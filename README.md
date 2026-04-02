# Blog application for readers and posters

# Functionality

- Regular readers can navigate to the "/" route to read the posts created by admin authors while authors can navigate to the "/dashboard" route to create posts as well as make post drafts.

# Built with

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT
- Multer
- React

# Building it

This project separated concerns between regular users and admin authors using role-based authentication with JWT tokens. Implementing Multer for image uploads added a nice visual element to the blog posts. Prisma made database operations smooth with its type-safe ORM while PostgreSQL handled data persistence reliably. Setting up separate React frontends for public readers and admin dashboard helped maintain clear boundaries between user experiences. The CORS configuration was crucial for enabling the frontend-backend communication during development.
