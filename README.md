# Underground Vault

A modern web application built for alternative music collectors to catalog their vinyl and cassette archives and engage in community-driven peer-to-peer (P2P) trading, inspired by Soulseek and Discogs.

---

## Key Features

- **Catalog Management (CRUD):** Add, view, edit, and delete physical releases with format tracking (Vinyl / Cassette), media grading (Mint to G), and pricing.
- **Discovery Engine:** Instant search and multi-criteria filtering by media format, sub-genre, and trade availability with optimized sorting.
- **P2P Trade Proposal Flow:** Propose and manage physical media swaps between collectors with status tracking (`Pending Trade`).
- **Activity & System Logging:** Automatic event logging for catalog changes, validation errors, and trade actions with local export capability.
- **Role-Based Access Simulation:** Write-protected operations (add, edit, delete, trade) guarded by client-side authentication.

---

## Tech Stack & Architecture

- **Frontend:** React 19, JavaScript (ES6+), Vite
- **Styling:** Tailwind CSS (v4)
- **State & Architecture:** Context API with Discriminated Unions, Atomic Component Structure (`atoms`, `molecules`, `organisms`)
- **Testing:** Vitest, Testing Library, JSDOM (Enforced >= 70% code coverage threshold)
- **Containerization & CI/CD:** Docker (Multi-stage build with Nginx Alpine), GitHub Actions

---

## Getting Started

### Prerequisites

Designed and tested on Linux (Ubuntu / Debian) and macOS environments.

- **Node.js:** `v20.0.0` or higher
- **npm:** `v10.0.0` or higher
- **Docker:** (Optional, for containerized execution)

---

### Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/kornigalit-cpu/underground-vault.git](https://github.com/kornigalit-cpu/underground-vault.git)
   cd underground-vault
   ```

2. **Install dependencies:**

   ```bash
   npm ci
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

---

### Running Tests & Quality Checks

Run the automated test suite and verify quality thresholds:

```bash
# Run unit tests
npm test

# Run tests with coverage report (fails if coverage < 70%)
npm run test:coverage

# Run static linter
npm run lint
```

---

### Running with Docker

Build and run the production-ready containerized application locally:

1. **Build the Docker Image:**

   ```bash
   docker build -t underground-vault:latest .
   ```

2. **Run the Container:**

   ```bash
   docker run -d -p 8080:80 --name underground-vault-app underground-vault:latest
   ```

3. Access the application in your browser at `http://localhost:8080`.
