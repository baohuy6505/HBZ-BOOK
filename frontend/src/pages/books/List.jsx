import { useState, useEffect } from 'react'
import { bookApi } from '../../api'
import Pagination from '../../components/Pagination'
import { ConfirmModal, UpdateModal } from '../../components/Modal'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [authors, setAuthors] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [editData, setEditData] = useState({ id: null, title: '', authorId: '' })
  const [editErrors, setEditErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchBooks = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await bookApi.getAll(p, 5)
      setBooks(res.data.content)
      setPage(res.data.page)
      setTotalPages(res.data.totalPages)
      setTotalElements(res.data.totalElements)
    } catch (err) {
      setError(err.message || 'Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      const res = await bookApi.getAllDropdown()
      setAuthors(res.data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    fetchBooks()
    fetchAuthors()
  }, [])

  const handleDelete = async () => {
    try {
      await bookApi.delete(deleteId)
      setDeleteId(null)
      fetchBooks(page)
    } catch (err) {
      setError(err.message || 'Failed to delete book')
    }
  }

  const handleEdit = (book) => {
    setEditData({ id: book.id, title: book.title, authorId: book.authorId })
    setEditErrors({})
  }

  const validateEdit = () => {
    const errs = {}
    if (!editData.title.trim()) errs.title = '* Please enter title'
    else if (editData.title.trim().length < 2) errs.title = '* Title must be at least 2 characters'
    if (!editData.authorId) errs.authorId = '* Please select author'
    setEditErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validateEdit()) return
    setSaving(true)
    try {
      await bookApi.update(editData.id, { title: editData.title.trim(), authorId: Number(editData.authorId) })
      setEditData({ id: null, title: '', authorId: '' })
      fetchBooks(page)
    } catch (err) {
      setEditErrors({ title: err.message || 'Failed to update book' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <>
      <div className="breadcrumb">Home / Books / List</div>
      <div className="page-body">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, idx) => (
              <tr key={b.id}>
                <td>{page * 5 + idx + 1}</td>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.authorName}</td>
                <td>
                  <button className="btn-icon edit" onClick={() => handleEdit(b)} title="Edit">✎</button>
                  <button className="btn-icon delete" onClick={() => setDeleteId(b.id)} title="Delete">✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => fetchBooks(p)}
        />
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Book"
          message="Are you sure you want to delete this book?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editData.id && (
        <UpdateModal title="Update Book" onSave={handleSave} onCancel={() => setEditData({ id: null, title: '', authorId: '' })}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <div>
              <input className="form-input" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
              {editErrors.title && <div className="field-error">{editErrors.title}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Author</label>
            <div>
              <select className="form-select" value={editData.authorId} onChange={(e) => setEditData({ ...editData, authorId: e.target.value })}>
                <option value="">Select Author</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {editErrors.authorId && <div className="field-error">{editErrors.authorId}</div>}
            </div>
          </div>
        </UpdateModal>
      )}
    </>
  )
}
