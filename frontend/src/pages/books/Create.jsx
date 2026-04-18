import { useState, useEffect } from 'react'
import { bookApi } from '../../api'
import { useNavigate } from 'react-router-dom'

export default function BookCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [authors, setAuthors] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    bookApi.getAllDropdown()
      .then((res) => setAuthors(res.data))
      .catch(() => {})
  }, [])

  const validate = () => {
    const errs = {}
    if (!title.trim()) errs.title = '* Please enter title'
    else if (title.trim().length < 2) errs.title = '* Title must be at least 2 characters'
    if (!authorId) errs.authorId = '* Please select author'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await bookApi.create({ title: title.trim(), authorId: Number(authorId) })
      navigate('/books')
    } catch (err) {
      setErrors({ title: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="breadcrumb">Home / Books / Create</div>
      <div className="page-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <div>
              <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter book title" />
              {errors.title && <div className="field-error">{errors.title}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Author</label>
            <div>
              <select className="form-select" value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                <option value="">Select Author</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {errors.authorId && <div className="field-error">{errors.authorId}</div>}
            </div>
          </div>
          <button type="submit" className="btn-create" disabled={saving}>
            {saving ? 'Saving...' : 'Create'}
          </button>
        </form>
      </div>
    </>
  )
}
