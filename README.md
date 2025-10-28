


# Carbon Footprint Calculator
Full-stack application for calculating and comparing carbon footprints of food products using Agrybalise emission factors.

**Stack:** Node.js/Express + TypeORM + PostgreSQL (backend) | Next.js 15 + React (frontend)

---
> This repository contains my submission for the Greenly Product Engineering Internship hiring test.
> To run locally:
> 1. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.
> 2. Follow the setup instructions below.

## Remarks

-The original assignment mentioned SQLite but the files used PostgreSQL so i decided it was better to stick to the current stack.  
-I added a missing db host line in dataSource.ts as well as one line to jest.json (maxworkers=1) for sequential testing since without both these changes some tests fail due to errors.

---

## Quickstart Guide

### Prerequisites
- Node.js v16 or later  
- Docker Desktop (with WSL 2 enabled on Windows)  

### Setup and Run

```bash
# Backend
cd back
npm install
docker-compose up -d          # Start PostgreSQL
npm run seed                  # Populate emission factors
npm run dev                   # Run backend on port 3000

# Frontend (in a new terminal)
cd front
npm install
npm run dev                   # Run frontend on port 3001
```

Access the application at **http://localhost:3001**

---

## Environment Configuration

Create a `.env` file in the `back` directory(and copy .env.example content in it or just use your own local credentials):

```env
DATABASE_HOST=localhost
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=carbon_db
DATABASE_PORT=5432
DATABASE_TEST_PORT=5433
MIGRATIONS_RUN=true
```

---

## Database and Seeding

The database is managed through Docker containers.  
After running `docker-compose up -d`, seed it with predefined emission factors:

```bash
npm run seed
```

This loads the base dataset (ham, cheese, tomato, flour, oliveOil, beef, blueCheese, vinegar).

---

## Running Unit Tests

To execute all backend tests:

```bash
cd back
npm test
```

All emission factor and product calculation tests are expected to pass successfully.

---

### Using the Application

- **Home** (`/`): Browse emission factors, click green button to open calculator
- **Calculator** (`/products`): Calculate footprints, view saved products


## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Cannot connect to database** | Ensure Docker Desktop is running. Run `docker ps` to verify containers. |
| **Engine stopped (Windows)** | Run `wsl --install` as Administrator in PowerShell, then restart Docker Desktop. |
| **Frontend not fetching data** | Verify backend is active at `http://localhost:3000`. |
| **Port already in use** | Adjust ports in `.env` file (default: 3000, 3001, 5432). |
| **Tests failing** | Ensure correct database configuration and that the containers are running. |

To stop services:

```bash
Ctrl+C
cd back && docker-compose down
```

---

## API Endpoints

### Carbon Emission Factors(pre-existent)
- `GET /carbon-emission-factors` - Retrieve all factors
- `POST /carbon-emission-factors` - Create new factor

### Products(new)
- `GET /products` - Retrieve all calculated products
- `GET /products/:id` - Retrieve specific product
- `POST /products` - Calculate and save product carbon footprint

---

## How It Works

### Calculation Logic

1. **Match ingredients** by name with emission factors (case-insensitive, whitespace-trimmed)
2. **Auto-convert units** if needed (100g to 0.1kg)
3. **Calculate**: `convertedQuantity × emissionCO2eInKgPerUnit`
4. **Sum** all ingredient emissions
5. Return `null` if any ingredient cannot be matched or converted

**Example:**
```javascript
// Input (ingredients in grams)
{
  "name": "Ham Cheese Pizza",
  "ingredients": [
    { "name": "ham", "quantity": 100, "unit": "g" },
    { "name": "cheese", "quantity": 150, "unit": "g" },
    { "name": "tomato", "quantity": 400, "unit": "g" }
  ]
}

// System converts: 100g to 0.1kg (emission factors stored in kg)

// Output
{
  "totalCarbonFootprint": 0.041,
  "breakdown": [
    { "name": "ham", "quantity": 0.1, "unit": "kg", "emissionCO2eInKg": 0.011 },
    { "name": "cheese", "quantity": 0.15, "unit": "kg", "emissionCO2eInKg": 0.018 },
    { "name": "tomato", "quantity": 0.4, "unit": "kg", "emissionCO2eInKg": 0.052 }
  ]
}
```
## Files added to the pre-existing project 
### Backend:

back/src/product/product.entity.ts* — Product entity with ingredients and results

back/src/product/product.service.ts* — Calculation logic and database operations

back/src/product/product.controller.ts — REST API controller

back/src/product/product.service.test.ts — Unit tests for calculation logic

back/src/product/dto/create-product.dto.ts — Input validation types

back/src/product/dto/product-response.dto.ts — API response types

back/migrations/1708367894382-product.ts — Database migration for products table

### Frontend:

front/src/app/products/page.tsx — Product calculator page

front/src/components/ProductForm.tsx — Form for entering product ingredients

front/src/components/ProductResults.tsx — Display calculation results and breakdown

front/src/components/ProductList.tsx — List of saved products for comparison

front/src/app/api/products/route.ts — API route proxy

front/src/types/product.ts — TypeScript type definitions

*Remark* : there are other small modifications such as adding the calculator button in the home page in app/page.tsx and of course adding the .env with the local database credentials (which you can configure however you want)
---

This completes the implementation of the assignment requirements:  
calculation of carbon footprints, persistence of results, and API access through a simple full-stack interface.
