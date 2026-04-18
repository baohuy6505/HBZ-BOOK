export default function Pagination({ page, size, totalElements, totalPages, onPageChange }) {
  const total = totalPages

  if (total <= 1) return null

  const pages = []
  for (let i = 0; i < total; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      <button
        className="page-btn"
        disabled={page >= total - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  )
}
