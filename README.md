# Mpolychk Enterprise Dashboard

Mpolychk Enterprise Dashboard is a single page enterprise access-management dashboard built with Angular, TypeScript, TailwindCSS, Angular Material, RxJS, and a mock API layer backed by browser LocalStorage.

The project was developed for an internship assignment that required a role-based SPA with login, user/admin flows, async API simulation, dashboard records, and admin user management.

## Project Objective

Build a production-style Angular SPA that demonstrates:

- Login with User ID, Password, and Role.
- Role-based navigation for General User and Admin.
- Logged-in dashboard with user details.
- Async API call simulation with loading states.
- Table-based access records.
- Admin user management.
- Service-based modular architecture.
- Clean, creative, enterprise-grade UI.

## Tech Stack

- Angular 21 standalone architecture, compatible with Angular 12+ assignment expectations.
- TypeScript.
- TailwindCSS.
- Angular Material.
- RxJS.
- LocalStorage as mock database.
- Angular SSR-ready project structure.
- Express dependency available through Angular SSR setup.

## Application Flow

### 1. App Startup Flow

When the app starts, Angular loads the application configuration from:

```text
frontend/src/app/app.config.ts
```

The app registers:

- Router configuration.
- Browser hydration.
- Session initialization through `SessionContextService`.

The session initializer checks LocalStorage and restores the current mock session if the user already logged in earlier.

Relevant files:

```text
frontend/src/app/app.config.ts
frontend/src/app/core/services/session-context.service.ts
frontend/src/app/core/services/auth.service.ts
frontend/src/app/core/constants/storage.constants.ts
```

### 2. Routing Flow

Routes are configured in:

```text
frontend/src/app/app.routes.ts
```

Route behavior:

- `/` loads the login page.
- `/dashboard` loads the logged-in dashboard.
- `/admin` loads the admin panel.
- Unknown routes redirect to `/dashboard`.

Protected routes use guards:

- `authGuard` protects dashboard pages.
- `adminGuard` protects the admin panel.

Relevant files:

```text
frontend/src/app/guards/auth.guard.ts
frontend/src/app/guards/admin.guard.ts
frontend/src/app/layouts/dashboard-layout/dashboard-layout.ts
```

### 3. Login Flow

The login page collects:

- User ID.
- Password.
- Role: General User or Admin.

The form uses Angular Reactive Forms with validation. On submit, `AuthService.login()` simulates a backend login request with an async delay and stores the session in LocalStorage.

Login result:

- Admin users are routed to `/admin`.
- General users are routed to `/dashboard`.

Relevant files:

```text
frontend/src/app/features/auth/login/login.ts
frontend/src/app/features/auth/login/login.html
frontend/src/app/core/services/auth.service.ts
frontend/src/app/models/user.model.ts
```

### 4. Mock API And LocalStorage Flow

The app uses `MockApiService` as a backend-like abstraction. This makes the frontend easy to migrate later to Node.js, MongoDB, DynamoDB, or another backend.

Mock API responsibilities:

- Read users from LocalStorage.
- Seed default users if no users exist.
- Persist admin user changes.
- Return dashboard data.
- Simulate async API delay using a delay parameter.

LocalStorage keys:

```text
mpc_session
mpc_users
user
```

Relevant files:

```text
frontend/src/app/core/services/mock-api.service.ts
frontend/src/app/core/constants/seed-data.ts
frontend/src/app/core/constants/storage.constants.ts
```

### 5. Logged-In Dashboard Flow

After login, the dashboard loads the current session from `SessionContextService`.

Then it calls:

```text
DashboardService.getDashboardData(session, delayMs)
```

This returns dynamic data based on the logged-in role.

For General User:

- Shows user profile details.
- Shows department-scoped access records.
- Shows user-specific analytics.
- Shows recent access logs for that user.

For Admin:

- Shows enterprise-level stats.
- Shows global access records.
- Shows admin-level access logs.
- Shows broader sync and risk review data.

Dashboard sections:

- Welcome header.
- Logged-in user profile.
- Access summary.
- Analytics cards.
- Access intelligence chart.
- Sync status.
- Activity timeline.
- Access records table.
- Recent access logs.

Relevant files:

```text
frontend/src/app/features/dashboard/home/home.ts
frontend/src/app/features/dashboard/home/home.html
frontend/src/app/services/dashboard.ts
frontend/src/app/models/dashboard.model.ts
```

### 6. Admin Panel Flow

Admin users can manage mock database users from `/admin`.

Admin features:

- View all users.
- Search users by name, email, or department.
- Filter users by role.
- Filter users by status.
- Add user through modal.
- Edit user role/status/details.
- Delete user.
- Pagination.
- Role badges.
- Status badges.
- Toast notifications.

All admin changes are persisted to LocalStorage through `UserService` and `MockApiService`.

Relevant files:

```text
frontend/src/app/features/admin/admin-panel/admin-panel.ts
frontend/src/app/features/admin/admin-panel/admin-panel.html
frontend/src/app/services/user.service.ts
frontend/src/app/shared/modal/modal.ts
frontend/src/app/shared/toast/toast.ts
```

### 7. Shared Layout Flow

After login, all protected pages render inside the dashboard layout.

The layout contains:

- Sidebar.
- Navbar.
- Router outlet.
- Toast outlet.

Relevant files:

```text
frontend/src/app/layouts/dashboard-layout/dashboard-layout.html
frontend/src/app/shared/sidebar/sidebar.html
frontend/src/app/shared/navbar/navbar.html
frontend/src/app/shared/toast/toast.html
```

### 8. UI And Design Flow

The UI is designed as a dark enterprise SaaS dashboard inspired by modern tools such as Linear, Vercel, Clerk, Stripe Dashboard, Notion dark mode, and Supabase.

UI characteristics:

- Dark theme.
- Glassmorphism panels.
- Gradient brand accents.
- Responsive dashboard grid.
- Hover states.
- Loading spinner states.
- Modal system.
- Badge-based status indicators.
- Clean spacing and typography.

Global styles are configured in:

```text
frontend/src/styles.scss
```

Tailwind configuration:

```text
frontend/tailwind.config.js
```

## Folder Structure

```text
frontend/src/app
|-- core
|   |-- constants
|   `-- services
|-- features
|   |-- admin
|   |   `-- admin-panel
|   |-- auth
|   |   `-- login
|   `-- dashboard
|       `-- home
|-- guards
|-- interceptors
|-- layouts
|   `-- dashboard-layout
|-- models
|-- services
`-- shared
    |-- data-table
    |-- modal
    |-- navbar
    |-- sidebar
    `-- toast
```

## Important Architecture Decisions

### Standalone Angular Components

The app uses Angular standalone components instead of traditional NgModules. This keeps the code modern, modular, and easier to lazy load.

### Service-Based Architecture

Business logic is kept inside services:

- `AuthService` handles login/logout/session persistence.
- `SessionContextService` restores session on app load.
- `MockApiService` simulates backend APIs.
- `DashboardService` builds dynamic dashboard data.
- `UserService` manages admin user operations.
- `ToastService` handles notifications.

### Models And Interfaces

Data contracts are defined in the `models` folder. This improves type safety and makes the code easier to migrate to a real backend later.

### Mock Backend Boundary

The application does not directly read/write LocalStorage from feature components. Instead, LocalStorage is wrapped inside `MockApiService`, which acts like a mock backend layer.

This makes it easier to replace LocalStorage with:

- Node.js API.
- MongoDB.
- AWS DynamoDB.
- REST API.
- GraphQL API.

### Role-Based Security

The app uses route guards:

- General authenticated users can access dashboard.
- Only admin users can access admin panel.

This improves structure and mirrors real enterprise dashboard routing.

## How To Run The Project

### 1. Go To Frontend Folder

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

Open:

```text
http://localhost:4200
```

### 4. Build Production Bundle

```bash
npm run build
```

## Login Instructions

This is a mock login system. You can use any User ID and Password because the goal is to demonstrate frontend authentication flow and role-based routing.

Example General User:

```text
User ID: user.demo
Password: password123
Role: General User
```

Example Admin:

```text
User ID: admin.demo
Password: password123
Role: Admin
```

## Feature Checklist

- Login page with User ID, Password, and Role.
- General User and Admin roles.
- Mock API response with async delay.
- LocalStorage mock database.
- Session persistence.
- App-load session restoration.
- Route guards.
- Dashboard page.
- Logged-in user details.
- Dynamic role-based dashboard data.
- Access records table.
- Loading states.
- Admin user management.
- Add user modal.
- Edit user.
- Delete user.
- Search users.
- Filter users.
- Pagination.
- Toast notifications.
- Reusable modal component.
- Reusable data table component.
- Shared sidebar and navbar.
- Clean models and interfaces.
- TailwindCSS dark enterprise UI.

## Evaluation Criteria Mapping

### Effective Use Of Angular Framework

The project uses:

- Standalone components.
- Lazy-loaded routes.
- Reactive Forms.
- Route guards.
- Dependency injection.
- RxJS Observables.
- Angular Material form controls.
- Component-based architecture.

### Knowledge Of API And Cloud Framework

The project includes a mock backend boundary using `MockApiService`. The mock API simulates latency and persistence, and it can be replaced by a Node.js, MongoDB, AWS DynamoDB, or REST API backend.

### UI Aspects

The UI is custom-built with TailwindCSS and Angular Material. It includes a premium dark theme, dashboard layout, glass panels, loading states, cards, tables, badges, modal interactions, and responsive spacing.

### Clean Code Architecture

The code separates:

- UI components.
- Business services.
- Guards.
- Models.
- Constants.
- Shared reusable components.

## Future Improvements

- Add real Node.js backend API.
- Add JWT validation.
- Add MongoDB or DynamoDB persistence.
- Add unit tests for services and guards.
- Add role permission matrix.
- Add audit log export.
- Add API interceptors for request logging.
- Add real chart rendering with Chart.js.

## Project Status

The current project is feature-complete for the internship assignment and has a scalable structure that can be extended into a real enterprise SaaS dashboard.
