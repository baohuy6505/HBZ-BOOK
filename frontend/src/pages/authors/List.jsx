import { useState, useEffect } from 'react'
import { authorApi } from '../../api'
import Pagination from '../../components/Pagination'
import { ConfirmModal, UpdateModal } from '../../components/Modal'

export default function AuthorList() {
  const [authors, setAuthors] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [deleteId, setDeleteId] = useState(null)
  const [editData, setEditData] = useState({ id: null, name: '' })
  const [editErrors, setEditErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchAuthors = async (p = 0) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authorApi.getAll(p, 5)
      setAuthors(res.data.content)
      setPage(res.data.page)
      setTotalPages(res.data.totalPages)
      setTotalElements(res.data.totalElements)
    } catch (err) {
      setError(err.message || 'Failed to load authors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAuthors() }, [])

  const handleDelete = async () => {
    try {
      await authorApi.delete(deleteId)
      setDeleteId(null)
      fetchAuthors(page)
    } catch (err) {
      setError(err.message || 'Failed to delete author')
    }
  }

  const handleEdit = (author) => {
    setEditData({ id: author.id, name: author.name })
    setEditErrors({})
  }

  const validateEdit = () => {
    const errs = {}
    if (!editData.name.trim()) errs.name = '* Please enter name'
    else if (editData.name.trim().length < 2) errs.name = '* Name must be at least 2 characters'
    setEditErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validateEdit()) return
    setSaving(true)
    try {
      await authorApi.update(editData.id, { name: editData.name.trim() })
      setEditData({ id: null, name: '' })
      fetchAuthors(page)
    } catch (err) {
      setEditErrors({ name: err.message || 'Failed to update author' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <>
      <div className="breadcrumb">Home / Authors / List</div>
      <div className="page-body">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Books</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a, idx) => (
              <tr key={a.id}>
                <td>{page * 5 + idx + 1}</td>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.books}</td>
                <td>
                  <button className="btn-icon edit" onClick={() => handleEdit(a)} title="Edit">✎</button>
                  <button className="btn-icon delete" onClick={() => setDeleteId(a.id)} title="Delete">✖</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => fetchAuthors(p)}
        />
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Author"
          message="Are you sure you want to delete this author?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editData.id && (
        <UpdateModal title="Update Author" onSave={handleSave} onCancel={() => setEditData({ id: null, name: '' })}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <div>
              <input
                className="form-input"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              {editErrors.name && <div className="field-error">{editErrors.name}</div>}
            </div>
          </div>
        </UpdateModal>
      )}
    </>
  )
}
