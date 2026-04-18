import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AuthorList from './pages/authors/List'
import AuthorCreate from './pages/authors/Create'
import BookList from './pages/books/List'
import BookCreate from './pages/books/Create'
import ReviewList from './pages/reviews/List'
import ReviewCreate from './pages/reviews/Create'
import './index.css'

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="app-layout">
      <header className="app-header">HAIBAZO BOOK REVIEW</header>
      <div className="app-body">
        <Sidebar currentPath={location.pathname} onNavigate={navigate} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AuthorList />} />
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/authors/create" element={<AuthorCreate />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/create" element={<BookCreate />} />
            <Route path="/reviews" element={<ReviewList />} />
            <Route path="/reviews/create" element={<ReviewCreate />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
