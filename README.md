# HAIBAZO BOOK REVIEW

A full-stack book review application built with Spring Boot, React, and PostgreSQL.

## Tech Stack

- **Backend**: Spring Boot 3.2, Spring Data JPA, PostgreSQL
- **Frontend**: React 19, Vite, React Router, Axios
- **Database**: PostgreSQL

## Project Structure

```
hbz-book-review/
├── backend/                    # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/haibazo/bookreview/
│       ├── BookReviewApplication.java
│       ├── entity/             # JPA Entities (Author, Book, Review)
│       ├── dto/                # Request/Response DTOs
│       ├── repository/         # JPA Repositories
│       ├── service/           # Business Logic
│       ├── controller/        # REST Controllers
│       ├── exception/          # Exception Handling
│       └── config/            # CORS, Data Seeder
│
└── frontend/                   # React SPA
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js              # Axios API service
        ├── index.css           # Global styles
        ├── components/         # Sidebar, Pagination, Modal
        └── pages/
            ├── authors/        # List, Create
            ├── books/          # List, Create
            └── reviews/        # List, Create
```

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+
- PostgreSQL 13+

## Setup & Run

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE bookreview;
```

Update `backend/src/main/resources/application.yml` with your PostgreSQL credentials.

### 2. Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will start at http://localhost:8080

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at http://localhost:5173

## API Endpoints

### Authors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors?page=0&size=5` | List authors with pagination |
| GET | `/api/authors/all` | List all authors (for dropdown) |
| GET | `/api/authors/{id}` | Get author by ID |
| POST | `/api/authors` | Create author |
| PUT | `/api/authors/{id}` | Update author |
| DELETE | `/api/authors/{id}` | Delete author |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books?page=0&size=5` | List books with pagination |
| GET | `/api/books/all` | List all books (for dropdown) |
| GET | `/api/books/{id}` | Get book by ID |
| POST | `/api/books` | Create book |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews?page=0&size=5` | List reviews with pagination |
| GET | `/api/reviews/{id}` | Get review by ID |
| POST | `/api/reviews` | Create review |
| PUT | `/api/reviews/{id}` | Update review |
| DELETE | `/api/reviews/{id}` | Delete review |

## Features

- **CRUD Operations**: Full create, read, update, delete for Authors, Books, and Reviews
- **Pagination**: Server-side pagination with configurable page size
- **Sidebar Navigation**: Expandable/collapsible menu with active state highlighting
- **Modal Dialogs**: Update and delete confirmation modals
- **Form Validation**: Client-side validation with error messages
- **Responsive Design**: Clean, professional UI following wireframe specifications
- **Sample Data**: Pre-seeded with sample authors, books, and reviews

## Sample Data

The application includes sample data seeded on first run:

**Authors**: Jack Troute, Inamori Kazuo, Stephen King, J. K. Rowling, Dan Brown

**Books**: The 22 Immutable Laws of Marketing, Positioning, Harry Potter series, The Shining, It, The Da Vinci Code, Amoeba Management

**Reviews**: 7 sample reviews
