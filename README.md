# Gluvia Admin Dashboard

A modern, full-featured admin dashboard for the Gluvia AI Backend built with Next.js, TypeScript, Zustand, and shadcn/ui.

## 🎉 Features

- ✅ **Complete Backend Integration** - Fully connected to Gluvia AI Backend API
- ✅ **Authentication** - Secure login with token-based auth and route protection
- ✅ **Foods Management** - CRUD operations for food database
- ✅ **Rule Templates** - Create and manage dietary rules
- ✅ **Audit Logs** - Track all administrative actions
- ✅ **Settings** - Database operations and user management
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Modern UI** - Beautiful components with shadcn/ui
- ✅ **Toast Notifications** - Real-time feedback with Sonner
- ✅ **Type Safety** - Full TypeScript support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Gluvia AI Backend running on `http://localhost:5000`

### Installation

1. **Clone and install dependencies**:

```bash
npm install
```

2. **Configure environment** (already created):

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_APP_NAME=Gluvia Admin
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Login with admin credentials**:

- Email: `admin@gluvia.com`
- Password: Your admin password

## 📁 Project Structure

```
app/
├── auth/
│   ├── login/page.tsx       # Login page
│   └── signup/page.tsx      # Signup page
├── dashboard/
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── page.tsx             # Dashboard overview
│   ├── foods/page.tsx       # Foods management
│   ├── rules/page.tsx       # Rule templates
│   ├── audit/page.tsx       # Audit logs
│   └── settings/page.tsx    # System settings
└── layout.tsx               # Root layout with auth guard

components/
├── ui/                      # shadcn/ui components
├── AuthGuard.tsx           # Route protection
├── app-sidebar.tsx         # Navigation sidebar
└── Authentication/         # Auth forms

stores/
├── useAuthStore.ts         # Authentication state
├── useFoodStore.ts         # Foods state
├── useRuleStore.ts         # Rules state
├── useAuditStore.ts        # Audit logs state
└── useAdminStore.ts        # Admin operations state
```

## 📚 Documentation

- **[DASHBOARD-SETUP.md](DASHBOARD-SETUP.md)** - Complete dashboard documentation
- **[INTEGRATION.md](INTEGRATION.md)** - Backend integration guide

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Tabler Icons
- **Notifications**: Sonner (shadcn)
- **Date Formatting**: date-fns

## 📱 Pages

### 1. Dashboard Overview (`/dashboard`)

- Statistics cards
- Interactive charts
- Data tables

### 2. Foods Management (`/dashboard/foods`)

- List and search foods
- Create new food items
- Edit nutritional information
- Batch upload support
- Category filtering

### 3. Rule Templates (`/dashboard/rules`)

- View all rules
- Create custom rules
- Manage rule types
- Version control

### 4. Audit Logs (`/dashboard/audit`)

- View system activity
- Filter by action type
- Track user operations
- Export capabilities

### 5. Settings (`/dashboard/settings`)

- Admin profile
- Database seeding
- User token management
- System information

## 🔒 Security

- ✅ Token-based authentication
- ✅ Protected routes with AuthGuard
- ✅ Automatic session management
- ✅ Admin role verification
- ✅ Secure API communication
- ✅ Auto-logout on token expiration

## 🎨 UI Components

All components from shadcn/ui are available:

- Tables, Cards, Badges
- Dialogs, Alert Dialogs
- Forms, Inputs, Selects
- Buttons, Separators
- Toast notifications
- And many more...

Add more components:

```bash
npx shadcn@latest add <component-name>
```

## 🔧 State Management

Uses Zustand for global state:

```typescript
// Example usage
import { useFoodStore } from "@/stores/useFoodStore";

const { foods, fetchFoods, createFood } = useFoodStore();
```

## 🌐 API Integration

All backend endpoints are integrated:

- ✅ Authentication (login, logout)
- ✅ Foods CRUD operations
- ✅ Rules CRUD operations
- ✅ Audit logs viewing
- ✅ Database seeding
- ✅ User token management

## 📖 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 🚢 Deployment

Deploy on [Vercel](https://vercel.com):

```bash
# Deploy to Vercel
vercel
```

Make sure to set environment variables in Vercel dashboard.

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Gluvia AI system.

---

**Ready to manage your Gluvia AI system!** 🚀

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
