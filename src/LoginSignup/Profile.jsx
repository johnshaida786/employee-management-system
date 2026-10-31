import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil, Eye, Shield, ShieldOff } from "lucide-react";
import Pagination from "./Pagination";
import "../Profile.css";

const API_URL = "https://backend-beta-tan-14.vercel.app";
const PAGE_SIZE = 4;

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  return photo.startsWith("http")
    ? photo
    : `${API_URL}/${photo.replace(/^\/+/, "")}`;
};

const Profile = () => {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = loggedInUser?.role === "admin";

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    status: "Active",
    role: "user",
    createdAt: null,
    profilePhoto: "",
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectionMode, setSelectionMode] = useState("individual");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [accountsError, setAccountsError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [submittingBulk, setSubmittingBulk] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const visibleAccounts = accounts;
  const colSpanCount = 6; 

  const allOnPageSelected =
    accounts.length > 0 &&
    accounts.every((account) => selectedAccounts.includes(account.id));

  const showSubmitRow = selectedAccounts.length > 0;

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

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/profile/getProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: loggedInUser.id }),
        });
        const result = await response.json().catch(() => ({}));
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
            role: loggedInUser.role || "user",
            createdAt: profile.createdAt || null,
            profilePhoto: photoURL,
          });
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        if (!cancelled) setProfileError(error.message || "Cannot connect to server.");
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

      if (!isAdmin) {
        if (user.id) {
          setAccounts([
            {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status,
              role: user.role,
              profilePhoto: user.profilePhoto,
            },
          ]);
          setTotalAccounts(1);
          setTotalPages(1);
        }
        setLoadingAccounts(false);
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/admin/getAccounts?page=${currentPage}&limit=${PAGE_SIZE}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Request failed (${response.status}): ${text.slice(0, 120)}`);
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
              role: account.role || "user", 
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
    return () => { cancelled = true; };
  }, [currentPage, isAdmin, user.id]);

  // ---------------- Handlers ----------------
  const handlePageChange = (nextPage) => {
    const page = Number(nextPage);
    if (Number.isNaN(page) || page < 1 || (totalPages > 0 && page > totalPages) || page === currentPage) return;
    setSelectedAccounts([]);
    setStatusFilter("");
    setSelectionMode("individual");
    setCurrentPage(page);
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectionMode("master");
      setSelectedAccounts(accounts.map((account) => account.id));
    } else {
      setSelectedAccounts([]);
      setSelectionMode("individual");
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    if (!value) {
      setSelectedAccounts([]);
      setSelectionMode("individual");
      return;
    }
    if (selectionMode === "master") {
      const oppositeStatusIds = accounts
        .filter((account) => (account.status || "Active") !== value)
        .map((account) => account.id);
      setSelectedAccounts(oppositeStatusIds);
    }
  };

  const handleAccountSelect = (accountId) => {
    if (selectionMode === "master") {
      setSelectionMode("individual");
      setSelectedAccounts([accountId]);
      return;
    }
    setSelectedAccounts((previous) =>
      previous.includes(accountId)
        ? previous.filter((id) => id !== accountId)
        : [...previous, accountId]
    );
  };

  // ---------------- Promote / Demote Role (No Alerts) ----------------
  const handleUpdateRole = async (accountId, newRole) => {
    setUpdatingRoleId(accountId);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/updateRole`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountId, role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      // Update the local state so the UI changes instantly without a page refresh
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === accountId ? { ...acc, role: newRole } : acc))
      );
      
    } catch (error) {
      console.error("Update role error:", error);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  // ---------------- Bulk submit (UPDATED: ONE REQUEST) ----------------
  const handleBulkSubmit = async () => {
    if (selectedAccounts.length === 0 || !statusFilter) return;

    setSubmittingBulk(true);

    try {
      const token = localStorage.getItem("token");
      
      // Send ONE single request with the array of selected IDs
      const response = await fetch(`${API_URL}/admin/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          accountIds: selectedAccounts, // Pass the array [1, 4, 5, 6]
          status: statusFilter 
        }),
      });

      if (!response.ok) throw new Error("Failed to update accounts.");

      // Update all selected accounts in the local state
      setAccounts((previous) =>
        previous.map((account) =>
          selectedAccounts.includes(account.id)
            ? { ...account, status: statusFilter }
            : account
        )
      );

      setSelectedAccounts([]);
      setStatusFilter("");
      setSelectionMode("individual");
    } catch (error) {
      console.error("Bulk submit error:", error);
    } finally {
      setSubmittingBulk(false);
    }
  };

  // ---------------- Individual status update ----------------
  const handleUpdateStatus = async (account) => {
    if (!selectedAccounts.includes(account.id)) return;

    const newStatus = (account.status || "Active") === "Active" ? "Inactive" : "Active";
    setUpdatingStatusId(account.id);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/updateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Individual updates still send a single ID
        body: JSON.stringify({ accountId: account.id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update account status.");

      setAccounts((previous) =>
        previous.map((item) => (item.id === account.id ? { ...item, status: newStatus } : item))
      );
      setSelectedAccounts((prev) => prev.filter((id) => id !== account.id));
    } catch (error) {
      console.error("Update status error:", error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ---------------- Render ----------------
  if (loadingProfile) {
    return <div className="profile-page"><div className="profile-loading">Loading profile...</div></div>;
  }

  return (
    <div className="profile-page">
      <section className="profile-header card">
        <div className="profile-avatar">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name || "Profile"} className="profile-avatar-img" />
          ) : ( <User size={36} /> )}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{user.name || "Unnamed User"}</h1>
          <p className="profile-email">{user.email || "Not available"}</p>
          <span className="badge badge-success">{user.status || "Active"}</span>
        </div>
        <button type="button" className="btn btn-primary edit-profile-button" onClick={() => navigate("/edit-profile")}>
          <Pencil size={16} /> Edit Profile
        </button>
      </section>

      {profileError && <p className="profile-password-error">{profileError}</p>}

      <section className="section-block">
        <h2 className="section-title">Account Information</h2>

        <div className="account-table-card">
          {isAdmin && showSubmitRow && (
            <div className="submit-row-above-table">
              <select className="status-filter-dropdown" value={statusFilter} onChange={handleFilterChange} disabled={submittingBulk}>
                <option value="">Select status…</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="button" className="bulk-submit-btn" onClick={handleBulkSubmit} disabled={submittingBulk || !statusFilter}>
                {submittingBulk ? "Saving..." : `Submit (${selectedAccounts.length})`}
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
                    {isAdmin && (
                      <input type="checkbox" className="account-checkbox master-checkbox" checked={allOnPageSelected} onChange={handleSelectAll} />
                    )}
                  </th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loadingAccounts ? (
                  <tr><td colSpan={colSpanCount} className="accounts-message-cell">Loading accounts...</td></tr>
                ) : accountsError ? (
                  <tr><td colSpan={colSpanCount} className="accounts-message-cell accounts-error">{accountsError}</td></tr>
                ) : visibleAccounts.length === 0 ? (
                  <tr><td colSpan={colSpanCount} className="accounts-message-cell">No accounts found.</td></tr>
                ) : (
                  visibleAccounts.map((account) => {
                    const isSelected = selectedAccounts.includes(account.id);
                    // Check if this row belongs to the currently logged-in user
                    const isSelf = account.id === user.id;

                    return (
                      <tr key={account.id}>
                        <td>
                          <div className="account-user">
                            <div className="account-user-avatar">
                              {account.profilePhoto ? (
                                <img src={account.profilePhoto} alt={account.name || "Account"} className="account-user-avatar-img" />
                              ) : ( <User size={22} /> )}
                            </div>
                            <span>{account.name || "Not available"}</span>
                          </div>
                        </td>
                        <td>{account.email || "Not available"}</td>
                        <td>{account.phone || "Not available"}</td>
                        <td>
                          <span className={`account-status ${(account.status || "Active") === "Active" ? "status-active" : "status-inactive"}`}>
                            {account.status || "Active"}
                          </span>
                        </td>
                        <td className="toggle-cell">
                          <input type="checkbox" className="account-checkbox" checked={isSelected} onChange={() => handleAccountSelect(account.id)} />
                        </td>
                        <td className="actions-cell">
                          <div className="account-actions">
                            
                            {/* --- PROMOTE / DEMOTE BUTTONS --- */}
                            {isAdmin && !isSelf && (
                              account.role === "admin" ? (
                                <button
                                  type="button"
                                  className="table-action demote-action"
                                  title="Remove Admin Access"
                                  disabled={updatingRoleId === account.id}
                                  onClick={() => handleUpdateRole(account.id, "user")}
                                >
                                  {updatingRoleId === account.id ? "..." : <ShieldOff size={17} />}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="table-action promote-action"
                                  title="Make Secondary Admin"
                                  disabled={updatingRoleId === account.id}
                                  onClick={() => handleUpdateRole(account.id, "admin")}
                                >
                                  {updatingRoleId === account.id ? "..." : <Shield size={17} />}
                                </button>
                              )
                            )}
                            
                            <button type="button" className="table-action view-action" title="View Profile" onClick={() => navigate("/view-profile", { state: { profileId: account.id } })}>
                              <Eye size={17} />
                            </button>
                            <button type="button" className="table-action edit-action" title="Edit Profile" onClick={() => navigate("/edit-profile", { state: { profileId: account.id } })}>
                              <Pencil size={17} />
                            </button>
                            <button type="button" className="update-action-btn" disabled={updatingStatusId === account.id || !isSelected} onClick={() => handleUpdateStatus(account)}>
                              {updatingStatusId === account.id ? "Saving..." : "Update"}
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
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalAccounts} pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;