# Orders & Products - Test Task

SPA application for managing orders and products using Next.js, NestJS, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git
- PostgreSQL database (or use provided Railway database)

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/ruslansavustian/saas-template.git
cd saas-template
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Database Setup

```bash
# Run database migrations (if needed)
cd backend
npm run build
npm run start:prod
```

### 5. Run Application

```bash
# Option 1: Run everything with Docker
npm run dev

# Option 2: Run separately
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 6. Service Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api

## 🔧 Alternative Installation Methods

### Method 1: Docker Compose (Recommended)

```bash
# Clone and setup
git clone https://github.com/ruslansavustian/saas-template.git
cd saas-template

# Copy environment
cp env.example .env

# Run with Docker
docker-compose up -d
```

### Method 2: Manual Setup

```bash
# 1. Clone repository
git clone https://github.com/ruslansavustian/saas-template.git
cd saas-template

# 2. Setup environment
cp env.example .env
# Edit .env with your database URL

# 3. Install all dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Build and run
cd backend && npm run build && npm run start:prod &
cd frontend && npm run dev &
```

### Method 3: Development Mode

```bash
# For development with hot reload
npm run dev:backend  # Backend with watch mode
npm run dev:frontend # Frontend with hot reload
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000/3001
   sudo lsof -ti:3000 | xargs kill -9
   sudo lsof -ti:3001 | xargs kill -9
   ```

2. **Database connection issues**
   ```bash
   # Check .env file
   cat .env
   # Ensure DATABASE_URL is correct
   ```

3. **Node modules issues**
   ```bash
   # Clean install
   rm -rf node_modules backend/node_modules frontend/node_modules
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

4. **Permission issues**
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER .
   ```

### 4. Testing

# Backend tests

npm run test:backend (API tests)

# Frontend tests

npm run test:frontend (unit tests)

## 📝 Checklist of Implemented Technologies

### ✅ Required Tools (Junior)

- ✅ **React.js** - latest version (frontend/src/)
- ✅ **Redux** - Redux Toolkit (frontend/src/store/)
- ✅ **CSS Architecture** - BEM methodology (frontend/src/components/dashboard/dashboard.css)
- ✅ **CSS Frameworks** - Bootstrap 5 (frontend/package.json)
- ✅ **REST** - Axios for API requests (frontend/src/store/slices/)
- ✅ **Form Validation** - React Hook Form (frontend/src/hooks/useForm.ts)
- ✅ **Git** - version control (git repository)
- ✅ **Docker** - containerization (docker-compose.yml)
- ✅ **WebSocket** - Socket.io (backend/src/websocket/, frontend/src/hooks/use-socket.ts)

### ✅ Junior+ Level

- ✅ **TypeScript** - full typing (frontend/tsconfig.json, backend/tsconfig.json)
- ✅ **SSR** - Next.js 14 with App Router (frontend/src/app/)
- ✅ **Unit tests** - Jest + React Testing Library (frontend/**tests**/, backend/src/test/)
- ✅ **i18n** - next-intl (frontend/src/i18n/, frontend/src/messages/)
- ✅ **JWT** - authentication (backend/src/auth/, frontend/src/store/slices/auth-slice.ts)
- ✅ **Web Storage** - localStorage (token auth)
- ✅ **Lazy Loading** - Dynamic localization imports (frontend/src/app/[locale]/layout.tsx)
- ✅ **Charts** - Recharts (frontend/src/components/dashboard/statistics/orders-charts.tsx)
- ✅ **Maps** - Leaflet (frontend/src/components/dashboard/service-points/map.tsx)

### ⚠️ Middle Level

- ✅ **Graph** - Pagination for large lists (frontend/src/components/dashboard/products/product-table.tsx)
- ❌ **GraphQL** - Apollo Client (NOT implemented)
- ❌ **Web Workers** - for heavy computations (NOT implemented)
- ❌ **PWA** - Service Workers + manifest (NOT implemented)
- ✅ **Event-Driven Architecture** - WebSocket events (backend/src/websocket/websocket.gateway.ts)
- ✅ **FrontEnd Optimization** - virtualization, memoization (frontend/src/components/dashboard/products/)
- ✅ **Task Runners** - npm scripts (package.json scripts)
- ✅ **Integration tests** - E2E (backend/src/test/orders.integration.spec.ts)

## 📊 Final Statistics

### Junior Level: 9/9 ✅ (100%)

### Junior+ Level: 8/9 ✅ (89%)

### Middle Level: 5/8 ✅ (63%)

**Overall Project Level: Junior+** 🎯

### ❌ Not Implemented:

- **GraphQL** (Apollo Client)
- **Web Workers**
- **PWA** (Service Workers)

```

```
