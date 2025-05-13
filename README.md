# Mini E-Commerce Application

A simple e-commerce web application with product submission and display functionality.

## Features

- Product submission form
- Product listing with cards
- Product search functionality
- PostgreSQL database storage

## Extra Features

- Image preview option before adding product.
- Product search functionality using Contextual Search 
- Option to toggle between List view and grid View for available products
- Product sorting on the bases of Newest, Oldest, Name, Price : Low - High and Price : High to Low
- UI with some animations
- Responsive for all screens


## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database named `ecommerce`:

```sql
CREATE DATABASE ecommerce;
```

2. Configure the database connection:

Create a `.env` file in the backend directory with the following:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
PORT=5000
```

Update the values to match your PostgreSQL configuration.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on http://localhost:5000.

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The React app will start on http://localhost:5173.

## Usage

1. Navigate to the "Product Submission" tab to add a new product
2. Fill in the product details and submit
3. Switch to the "My Products" tab to view all submitted products
4. Use the search bar to find specific products 