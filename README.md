# Orders & Products - Test Task

SPA application for managing orders and products using Next.js, NestJS, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone and Run

```bash
# Clone repository
git clone <repository-url>
cd project

npm install

npm run dev (run frontend + backend in Docker)
```

### 3. Service Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api

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
