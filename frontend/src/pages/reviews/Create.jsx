import { useState, useEffect } from 'react'
import { reviewApi, bookApi } from '../../api'
import { useNavigate } from 'react-router-dom'

export default function ReviewCreate() {
  const navigate = useNavigate()
  const [bookId, setBookId] = useState('')
  const [content, setContent] = useState('')
  const [books, setBooks] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    bookApi.getAllDropdown()
      .then((res) => setBooks(res.data))
      .catch(() => {})
  }, [])

  const validate = () => {
    const errs = {}
    if (!bookId) errs.bookId = '* Please select book'
    if (!content.trim()) errs.content = '* Please enter content'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await reviewApi.create({ bookId: Number(bookId), content: content.trim() })
      navigate('/reviews')
    } catch (err) {
      setErrors({ content: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="breadcrumb">Home / Reviews / Create</div>
      <div className="page-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book</label>
            <div>
              <select className="form-select" value={bookId} onChange={(e) => setBookId(e.target.value)}>
                <option value="">Select Book</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title} - {b.authorName}</option>)}
              </select>
              {errors.bookId && <div className="field-error">{errors.bookId}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <div>
              <textarea className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter review content" />
              {errors.content && <div className="field-error">{errors.content}</div>}
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
