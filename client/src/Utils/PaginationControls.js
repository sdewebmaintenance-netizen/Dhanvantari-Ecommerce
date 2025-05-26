const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  entriesPerPage,
  totalEntries,
}) => {
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="pagination-controls">
      <div className="entries-info">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </div>
      
      <div className="page-navigation">
        <button 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
        >
          «
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          ‹
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;