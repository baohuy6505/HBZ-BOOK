import { useState, useEffect } from 'react'
import { reviewApi, bookApi } from '../../api'
import Pagination from '../../components/Pagination'
import { ConfirmModal, UpdateModal } from '../../components/Modal'

export default function ReviewList() {
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [books, setBooks] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [editData, setEditData] = useState({ id: null, content: '', bookId: '' })
  const [editErrors, setEditErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchReviews = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await reviewApi.getAll(p, 5)
      setReviews(res.data.content)
      setPage(res.data.page)
      setTotalPages(res.data.totalPages)
      setTotalElements(res.data.totalElements)
    } catch (err) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const fetchBooks = async () => {
    try {
      const res = await bookApi.getAllDropdown()
      setBooks(res.data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchReviews()
    fetchBooks()
  }, [])

  const handleDelete = async () => {
    try {
      await reviewApi.delete(deleteId)
      setDeleteId(null)
      fetchReviews(page)
    } catch (err) {
      setError(err.message || 'Failed to delete review')
    }
  }

  const handleEdit = (review) => {
    setEditData({ id: review.id, content: review.content, bookId: review.bookId })
    setEditErrors({})
  }

  const validateEdit = () => {
    const errs = {}
    if (!editData.content.trim()) errs.content = '* Please enter content'
    if (!editData.bookId) errs.bookId = '* Please select book'
    setEditErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validateEdit()) return
    setSaving(true)
    try {
      await reviewApi.update(editData.id, { content: editData.content.trim(), bookId: Number(editData.bookId) })
      setEditData({ id: null, content: '', bookId: '' })
      fetchReviews(page)
    } catch (err) {
      setEditErrors({ content: err.message || 'Failed to update review' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <>
      <div className="breadcrumb">Home / Reviews / List</div>
      <div className="page-body">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Book</th>
              <th>Author</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, idx) => (
              <tr key={r.id}>
                <td>{page * 5 + idx + 1}</td>
                <td>{r.id}</td>
                <td>{r.bookTitle}</td>
                <td>{r.authorName}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.content}</td>
                <td>
                  <button className="btn-icon edit" onClick={() => handleEdit(r)} title="Edit">✎</button>
                  <button className="btn-icon delete" onClick={() => setDeleteId(r.id)} title="Delete">✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => fetchReviews(p)}
        />
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to delete this review?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editData.id && (
        <UpdateModal title="Update Review" onSave={handleSave} onCancel={() => setEditData({ id: null, content: '', bookId: '' })}>
          <div className="form-group">
            <label className="form-label">Book</label>
            <div>
              <select className="form-select" value={editData.bookId} onChange={(e) => setEditData({ ...editData, bookId: e.target.value })}>
                <option value="">Select Book</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title} - {b.authorName}</option>)}
              </select>
              {editErrors.bookId && <div className="field-error">{editErrors.bookId}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <div>
              <textarea className="form-textarea" value={editData.content} onChange={(e) => setEditData({ ...editData, content: e.target.value })} />
              {editErrors.content && <div className="field-error">{editErrors.content}</div>}
            </div>
          </div>
        </UpdateModal>
      )}
    </>
  )
}
