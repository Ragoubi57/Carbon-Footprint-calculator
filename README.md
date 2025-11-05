


# Carbon Footprint Calculator
Full-stack application for calculating and comparing carbon footprints of food products using Agrybalise emission factors.

**Stack:** Node.js/Express + TypeORM + PostgreSQL (backend) | Next.js 15 + React (frontend)

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
