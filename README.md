# CyberCopilote TPME

An AI-powered cybersecurity assistant for freelancers, solo founders, and very small French businesses (TPME). Built with React, FastAPI, and MongoDB.

## Architecture

| Layer | Tech | Directory |
|-------|------|-----------|
| Frontend | React 19 + Tailwind CSS + shadcn/ui + CRACO | `frontend/` |
| Backend | FastAPI + Motor (async MongoDB) | `backend/` |
| Database | MongoDB | — |
| AI | Gemini 3 Flash via emergentintegrations | — |

## Prerequisites

- **Node.js** >= 18 (recommended: 24)
- **Yarn** 1.x (`npm install -g yarn`)
- **Python** >= 3.10 (recommended: 3.12)
- **MongoDB** instance (local or cloud, e.g. MongoDB Atlas)

## Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | Database name |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |
| `ADMIN_EMAIL` | No | Admin account email (default: `admin@cybercopilote.fr`) |
| `ADMIN_PASSWORD` | No | Admin account password (default: `CyberAdmin2026!`) |
| `EMERGENT_LLM_KEY` | No | API key for Gemini AI chat |
| `FRONTEND_URL` | No | Frontend origin for CORS (default: `http://localhost:3000`) |

## Getting Started

### 1. Backend

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Copy and configure environment variables
cp .env.example backend/.env

# Run the server
uvicorn backend.server:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend

# Install dependencies
yarn install

# Start the dev server
yarn start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
testRepo2/
├── backend/
│   ├── server.py          # FastAPI application (main backend)
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components (shadcn/ui)
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── pages/         # Page components
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── craco.config.js    # CRACO config (webpack overrides)
│   └── tailwind.config.js # Tailwind CSS config
├── .github/workflows/     # CI/CD
├── .env.example           # Environment variable template
├── design_guidelines.json # UI/UX design system
└── memory/PRD.md          # Product requirements document
```

## Scripts

From the **repository root**:

```bash
npm run build       # Build the frontend for production
npm run start       # Start the frontend dev server
npm run lint        # Lint the frontend code
npm test            # Run frontend tests
```

From the **frontend/** directory:

```bash
yarn start          # Start the dev server
yarn build          # Production build
yarn test           # Run tests
```

## Features

- French-language UI throughout
- 16-question guided cybersecurity diagnostic
- Cyber hygiene score (7 categories, 0-100)
- Personalized action plan with task management
- AI chat assistant (Gemini 3 Flash)
- Emergency mode with step-by-step guides
- Learning center with educational content
- Email breach monitoring (HIBP integration)
- Domain security analysis (DNS/SPF/DKIM/DMARC/SSL)
- Password breach checking
- JWT authentication with brute-force protection
- PWA-ready with manifest.json

## License

ISC
