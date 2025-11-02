# Library Management Backend (Simple)

## Files included
- server.cjs         - app entry (reads .env and starts server)
- models.cjs         - Mongoose schemas for Book, User, Borrow, Return
- routes.cjs         - All API routes (register, login, books, borrow, return)
- package.json
- .env.example       - copy to .env and edit before running

## Quick start

1. Unzip the project folder.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and edit `DB_URI` if needed.
4. Start your local MongoDB (mongod or use Atlas).
5. Run `node server.cjs` to start the server.
6. Use Postman to test endpoints under `http://localhost:5000/api`:
   - POST /api/register      (register single or multiple users - accepts JSON array)
   - POST /api/login         (login -> returns JWT)
   - POST /api/books         (create book(s) - accepts array)
   - GET  /api/books         (list books)
   - POST /api/borrow        (borrow a book)
   - GET  /api/borrow        (list borrowed records)
   - POST /api/return        (return a book)
   - GET  /api/return        (list return records)
   - PUT  /api/books/:id     (update book details)

## Notes
- For protected routes you may want to add auth middleware later.
- The register and books endpoints accept either a single object or an array for bulk insert.
