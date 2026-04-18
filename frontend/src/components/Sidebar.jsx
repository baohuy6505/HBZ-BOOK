import { useState } from 'react'

const menuData = [
  {
    label: 'Authors',
    icon: <span className="icon" />,
    items: [
      { label: 'List', path: '/authors' },
      { label: 'Create', path: '/authors/create' },
    ],
  },
  {
    label: 'Books',
    icon: <span className="icon" />,
    items: [
      { label: 'List', path: '/books' },
      { label: 'Create', path: '/books/create' },
    ],
  },
  {
    label: 'Reviews',
    icon: <span className="icon" />,
    items: [
      { label: 'List', path: '/reviews' },
      { label: 'Create', path: '/reviews/create' },
    ],
  },
]

export default function Sidebar({ currentPath, onNavigate }) {
  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {}
    menuData.forEach((m) => {
      initial[m.label] = m.items.some((i) => currentPath.startsWith(i.path))
    })
    return initial
  })

  const toggle = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (path) => currentPath === path

  return (
    <nav className="sidebar">
      {menuData.map((menu) => (
        <div key={menu.label}>
          <div
            className={`sidebar-item ${openMenus[menu.label] ? 'active' : ''}`}
            onClick={() => toggle(menu.label)}
          >
            {menu.icon}
            <span style={{ flex: 1 }}>{menu.label}</span>
            <span className="chevron">{openMenus[menu.label] ? '▼' : '▶'}</span>
          </div>
          {openMenus[menu.label] && (
            <ul className="sidebar-sub">
              {menu.items.map((item) => (
                <li
                  key={item.path}
                  className={`sidebar-sub-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => onNavigate(item.path)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
