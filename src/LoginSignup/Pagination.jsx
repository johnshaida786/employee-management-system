import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import "./Pagination.css";

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("left-ellipsis");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("right-ellipsis");
  pages.push(totalPages);

  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 4,
  onPageChange,
}) => {
  if (!totalItems || totalPages <= 1) return null;

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="modern-pagination" aria-label="Account list pagination">
      <p className="modern-pagination-summary">
        Showing <strong>{firstItem}–{lastItem}</strong> of <strong>{totalItems}</strong> accounts
      </p>

      <div className="modern-pagination-controls">
        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={17} />
          <span>Previous</span>
        </button>

        <div className="pagination-page-list">
          {pages.map((page) => {
            if (typeof page !== "number") {
              return (
                <span className="pagination-ellipsis" key={page} aria-hidden="true">
                  <MoreHorizontal size={17} />
                </span>
              );
            }

            return (
              <button
                type="button"
                key={page}
                className={`pagination-page ${page === currentPage ? "active" : ""}`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
