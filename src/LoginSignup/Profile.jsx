import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil, Eye } from "lucide-react";
import Pagination from "./Pagination";
import "../Profile.css";

const API_URL = "http://localhost:5000";
const PAGE_SIZE = 4;

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  return photo.startsWith("http")
    ? photo
    : `${API_URL}/${photo.replace(/^\/+/, "")}`;
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "Active",
    createdAt: null,
    profilePhoto: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Turns ON when the user clicks the master checkbox,
  // stays ON while individual rows are toggled,
  // turns OFF when selection drops to 0 or page changes.
  const [masterMode, setMasterMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [accountsError, setAccountsError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [submittingBulk, setSubmittingBulk] = useState(false);

  // Derived: is every account on the current page selected?
  const allOnPageSelected =
    accounts.length > 0 &&
    accounts.every((account) => selectedAccounts.includes(account.id));

  // Derived: should the Submit button appear?
  // -> Only in master mode AND at least one row is still selected.
  const showSubmit = masterMode && selectedAccounts.length > 0;

  // ---------------- Profile header ----------------
  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
          navigate("/login");
          return;
        }

        const loggedInUser = JSON.parse(savedUser);
        if (!loggedInUser?.id) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/profile/${loggedInUser.id}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to load profile.");
        }

        const profile = result.user;
        if (!profile) throw new Error("Profile data was not returned.");

        const photoURL = getPhotoUrl(
          profile.profilePhoto || profile.profile_photo || ""
        );

        if (!cancelled) {
          setUser({
            id: profile.id || loggedInUser.id,
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            status: profile.status || "Active",
            createdAt: profile.createdAt || null,
            profilePhoto: photoURL,
          });

          const updatedSession = {
            ...loggedInUser,
            name: profile.name || loggedInUser.name,
            email: profile.email || loggedInUser.email,
            phone: profile.phone || loggedInUser.phone,
            profilePhoto: photoURL,
          };
          localStorage.setItem("user", JSON.stringify(updatedSession));
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        if (!cancelled)
          setProfileError(error.message || "Cannot connect to server.");
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    getProfile();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ---------------- Account list (paginated) ----------------
  useEffect(() => {
    let cancelled = false;

    const getAccounts = async () => {
      setLoadingAccounts(true);
      setAccountsError("");

      try {
        const response = await fetch(
          `${API_URL}/admin/accounts?page=${currentPage}&limit=${PAGE_SIZE}`
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(
            `Request failed (${response.status}): ${text.slice(0, 120)}`
          );
        }

        const result = await response.json();

        const fetchedAccounts = Array.isArray(result.accounts)
          ? result.accounts.map((account) => ({
              ...account,
              id: account.id,
              name: account.name || "",
              email: account.email || "",
              phone: account.phone || "",
              status: account.status || "Active",
              profilePhoto: getPhotoUrl(
                account.profilePhoto || account.profile_photo || ""
              ),
            }))
          : [];

        if (!cancelled) {
          setAccounts(fetchedAccounts);
          setTotalAccounts(Number(result.pagination?.totalAccounts || 0));
          setTotalPages(Number(result.pagination?.totalPages || 0));
        }
      } catch (error) {
        console.error("Account list loading error:", error);
        if (!cancelled) {
          setAccountsError(error.message || "Cannot connect to server.");
          setAccounts([]);
          setTotalAccounts(0);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled) setLoadingAccounts(false);
      }
    };

    getAccounts();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  // ---------------- Auto-exit master mode when nothing is selected ----------------
  useEffect(() => {
    if (masterMode && selectedAccounts.length === 0) {
      setMasterMode(false);
    }
  }, [masterMode, selectedAccounts]);

  // ---------------- Handlers ----------------
  const handlePageChange = (nextPage) => {
    const page = Number(nextPage);

    if (
      Number.isNaN(page) ||
      page < 1 ||
      (totalPages > 0 && page > totalPages) ||
      page === currentPage
    ) {
      return;
    }

    setSelectedAccounts([]);
    setMasterMode(false);
    setCurrentPage(page);
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedAccounts(checked ? accounts.map((a) => a.id) : []);
    setMasterMode(checked);      // <-- enter/exit master mode here only
  };

  const handleAccountSelect = (accountId) => {
    setSelectedAccounts((previous) =>
      previous.includes(accountId)
        ? previous.filter((id) => id !== accountId)
        : [...previous, accountId]
    );
    // Do NOT touch masterMode here — that's what keeps Submit visible.
  };

  // ---------------- Bulk submit ----------------
  const handleBulkSubmit = async () => {
    if (selectedAccounts.length === 0) return;

    setSubmittingBulk(true);

    try {
      const results = await Promise.all(
        selectedAccounts.map(async (id) => {
          const account = accounts.find((a) => a.id === id);
          if (!account) return null;

          const newStatus =
            (account.status || "Active") === "Active" ? "Inactive" : "Active";

          const response = await fetch(`${API_URL}/update-status/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(
              result.message || `Failed to update account ${id}.`
            );
          }

          return { id, newStatus };
        })
      );

      setAccounts((prev) =>
        prev.map((item) => {
          const updated = results.find((r) => r && r.id === item.id);
          return updated ? { ...item, status: updated.newStatus } : item;
        })
      );

      setSelectedAccounts([]);
      setMasterMode(false);      // <-- exit master mode after success
      window.alert(
        `Updated ${results.filter(Boolean).length} account(s) successfully.`
      );
    } catch (error) {
      console.error("Bulk submit error:", error);
      window.alert(error.message || "Bulk update failed.");
    } finally {
      setSubmittingBulk(false);
    }
  };

  // ---------------- Individual status update ----------------
  const handleUpdateStatus = async (account) => {
    if (!selectedAccounts.includes(account.id)) {
      window.alert("Please tick the checkbox for this row before updating.");
      return;
    }

    const newStatus =
      (account.status || "Active") === "Active" ? "Inactive" : "Active";

    setUpdatingStatusId(account.id);

    try {
      const response = await fetch(
        `${API_URL}/update-status/${account.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update account status."
        );
      }

      setAccounts((previous) =>
        previous.map((item) =>
          item.id === account.id ? { ...item, status: newStatus } : item
        )
      );

      setSelectedAccounts((prev) => prev.filter((id) => id !== account.id));

      window.alert(`Account status updated to ${newStatus}.`);
    } catch (error) {
      console.error("Update status error:", error);
      window.alert(error.message || "Cannot update account status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ---------------- Render ----------------
  if (loadingProfile) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ---------- Profile header ---------- */}
      <section className="profile-header card">
        <div className="profile-avatar">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name || "Profile"}
              className="profile-avatar-img"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement.classList.add(
                  "show-fallback"
                );
              }}
            />
          ) : (
            <User size={36} />
          )}
        </div>

        <div className="profile-header-info">
          <h1 className="profile-name">{user.name || "Unnamed User"}</h1>
          <p className="profile-email">{user.email || "Not available"}</p>
          <span className="badge badge-success">
            {user.status || "Active"}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary edit-profile-button"
          onClick={() => navigate("/edit-profile")}
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </section>

      {profileError && (
        <p className="profile-password-error">{profileError}</p>
      )}

      {/* ---------- Account Information ---------- */}
      <section className="section-block">
        <h2 className="section-title">Account Information</h2>

        <div className="account-table-card">
          {/* Submit button — OUTSIDE the table, aligned above the checkbox column.
              Now driven by `showSubmit` so unticking a single row does NOT hide it. */}
          {showSubmit && (
            <div className="submit-row-above-table">
              <button
                type="button"
                className="bulk-submit-btn"
                onClick={handleBulkSubmit}
                disabled={submittingBulk}
              >
                {submittingBulk
                  ? "Saving..."
                  : `Submit (${selectedAccounts.length})`}
              </button>
            </div>
          )}

          <div className="account-table-wrapper">
            <table className="account-table">
              <thead>
                <tr>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>STATUS</th>

                  <th className="toggle-header-cell">
                    <input
                      type="checkbox"
                      className="account-checkbox master-checkbox"
                      checked={allOnPageSelected}
                      onChange={handleSelectAll}
                      aria-label="Select all accounts on this page"
                    />
                  </th>

                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loadingAccounts ? (
                  <tr>
                    <td colSpan={6} className="accounts-message-cell">
                      Loading accounts...
                    </td>
                  </tr>
                ) : accountsError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="accounts-message-cell accounts-error"
                    >
                      {accountsError}
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="accounts-message-cell">
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => {
                    const isSelected = selectedAccounts.includes(account.id);

                    return (
                      <tr key={account.id}>
                        <td>
                          <div className="account-user">
                            <div className="account-user-avatar">
                              {account.profilePhoto ? (
                                <img
                                  src={account.profilePhoto}
                                  alt={account.name || "Account"}
                                  className="account-user-avatar-img"
                                  onError={(event) => {
                                    event.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <User size={22} />
                              )}
                            </div>
                            <span>{account.name || "Not available"}</span>
                          </div>
                        </td>
                        <td>{account.email || "Not available"}</td>
                        <td>{account.phone || "Not available"}</td>
                        <td>
                          <span
                            className={`account-status ${
                              (account.status || "Active") === "Active"
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {account.status || "Active"}
                          </span>
                        </td>

                        <td className="toggle-cell">
                          <input
                            type="checkbox"
                            className="account-checkbox"
                            checked={isSelected}
                            onChange={() => handleAccountSelect(account.id)}
                            aria-label={`Select ${
                              account.name || account.email
                            }`}
                          />
                        </td>

                        <td className="actions-cell">
                          <div className="account-actions">
                            <button
                              type="button"
                              className="table-action view-action"
                              title="View Profile"
                              onClick={() =>
                                navigate("/view-profile", {
                                  state: { profileId: account.id },
                                })
                              }
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              type="button"
                              className="table-action edit-action"
                              title="Edit Profile"
                              onClick={() =>
                                navigate("/edit-profile", {
                                  state: { profileId: account.id },
                                })
                              }
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              type="button"
                              className="update-action-btn"
                              disabled={
                                updatingStatusId === account.id || !isSelected
                              }
                              onClick={() => handleUpdateStatus(account)}
                              title={
                                isSelected
                                  ? "Toggle status"
                                  : "Tick the checkbox first"
                              }
                            >
                              {updatingStatusId === account.id
                                ? "Saving..."
                                : "Update"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loadingAccounts && !accountsError && totalAccounts > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalAccounts}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;