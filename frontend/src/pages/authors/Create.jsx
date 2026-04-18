import { useState } from 'react'
import { authorApi } from '../../api'
import { useNavigate } from 'react-router-dom'

export default function AuthorCreate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = '* Please enter name'
    else if (name.trim().length < 2) errs.name = '* Name must be at least 2 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await authorApi.create({ name: name.trim() })
      navigate('/authors')
    } catch (err) {
      setErrors({ name: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="breadcrumb">Home / Authors / Create</div>
      <div className="page-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <div>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter author name"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
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
