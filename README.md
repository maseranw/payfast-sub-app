# PayfastReactSubscribeApp - Supabase + PayFast Subscription App

This application serves as a comprehensive example demonstrating how to integrate and use the @ngelekanyo/payfast package's client subpath. It showcases a modern subscription management platform built with React, TypeScript, and Supabase, featuring PayFast payment processing, secure user management, and premium feature gating with a polished dark/light theme.

By exploring this app, developers can learn how to seamlessly implement PayFast subscriptions in their own projects using @ngelekanyo/payfast/client.


**Designed to work with [@ngelekanyo/payfast](https://www.npmjs.com/package/@ngelekanyo/payfast)**

## Features

### Authentication & User Management

- **Secure Authentication**: Email/password login with Supabase Auth
- **User Profiles**: Complete profile management with personal information
- **Protected Routes**: Secure access control throughout the application

### Subscription Management

- **PayFast Integration**: Secure payment processing for South African users
- **Multiple Plans**: Flexible subscription tiers (Basic, Pro)
- **Subscription Control**: Pause, resume, and cancel subscriptions
- **Real-time Status**: Live subscription status updates

### Premium Features

- **Reverse Text Tool**: Transform text by reversing character order
- **Emoji Blast Generator**: Create random emoji combinations
- **Feature Gating**: Plan-based access control for premium tools

### Modern UI/UX

- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Optimized for all device sizes
- **Smooth Transitions**: Subtle animations and micro-interactions
- **Flat, Saturated Color Palette**: Solid-color design elements, no gradients

### Customer Support

- **Contact System**: Built-in contact form with priority levels
- **Message Management**: Track and manage customer inquiries
- **Quick Response**: Automated acknowledgments and status tracking

### Technical Excellence

- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, Context API, and functional components
- **Supabase Backend**: Real-time database with Row Level Security
- **Tailwind CSS**: Utility-first styling with dark mode support

## Setup

1. **Clone and install dependencies**:

   ```bash
   npm install
   ```

2. **Set up Supabase**:

   - Create a new Supabase project
   - Run the provided migrations to set up database tables
   - Copy your Supabase URL and anon key

3. **Environment Variables**:

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase credentials and PayFast backend URL.

4. **PayFast Backend**:

   - The app uses `@ngelekanyo/payfast/client` for PayFast integration
   - Backend URL is configured via `VITE_BACKEND_URL` environment variable

5. **Run the app**:
   ```bash
   npm run dev
   ```

## Database Schema & Migrations

- All database schema changes, tables, policies, indexes, triggers, and sample data live under:
/supabase/migrations/

- `database.sql` contains the base schema (user profiles, subscription plans, features, subscriptions, contact messages, and associated RLS policies). Later-numbered migration files apply incremental changes on top of it — run them in order.

### Core Tables:

#### user_profiles

- User profile information (name, avatar, phone)
- Links to Supabase Auth users
- Row Level Security enabled

#### subscription_plans

- Available subscription tiers
- Pricing and billing cycle information
- Feature arrays for plan capabilities

#### subscriptions

- User subscription records
- PayFast integration fields
- Status tracking and period management
- Automatic updated_at triggers

#### subscription_features

- Available premium features
- Feature keys for access control
- Descriptive names and metadata

#### plan_features

- Many-to-many relationship between plans and features
- Enables flexible feature combinations
- Unique constraints prevent duplicates

#### contact_messages

- Customer support message system
- Priority levels and status tracking
- Admin response capabilities
- Full audit trail with timestamps

### Security Features:

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own data
- **Authenticated Access**: All operations require valid authentication
- **Secure Policies**: Granular permissions for different operations — client writes to `subscriptions` are limited to creating `pending` rows; all status transitions (active/paused/cancelled) are written server-side via the backend's service role key

## Key Features Explained

### Dark Mode Implementation

- **System Preference Detection**: Automatically detects user's system theme
- **Manual Toggle**: Users can override system preference
- **Persistent Storage**: Theme choice saved in localStorage
- **Smooth Transitions**: All elements transition smoothly between themes
- **Comprehensive Coverage**: Dark mode styling for all components

### PayFast Integration

- **Secure Payments**: All payment processing handled by PayFast
- **Subscription Management**: Full lifecycle management (create, pause, resume, cancel)
- **Real-time Updates**: Subscription status updates in real-time
- **Error Handling**: Comprehensive error handling and user feedback
- **South African Focus**: Optimized for South African payment methods

### Feature Gating System

- **Plan-based Access**: Features unlocked based on subscription plan
- **Real-time Checking**: Access control checked in real-time
- **Graceful Degradation**: Clear messaging when features are unavailable
- **Upgrade Prompts**: Seamless upgrade flow for locked features

## PayFast Integration

The application uses the `@ngelekanyo/payfast` package's `/client` subpath for seamless PayFast integration:

- **Payment Initiation**: Secure payment form generation
- **Subscription Management**: Full subscription lifecycle support
- **Webhook Handling**: Automatic payment status updates
- **Error Recovery**: Robust error handling and retry mechanisms

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation and theme toggle
│   ├── Footer.tsx      # Application footer with links
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication and user management
│   └── ThemeContext.tsx # Dark/light theme management
├── features/           # Feature components (ReverseText, EmojiBlast)
├── hooks/              # Reusable logic (subscription actions, etc.)
├── lib/                # Utility libraries (Supabase, PayFast, status helpers)
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main user dashboard
│   ├── Subscribe.tsx   # Subscription management
│   ├── Contact.tsx     # Customer support contact form
│   ├── Login.tsx       # Authentication page
│   ├── Success.tsx     # Payment success page
│   └── Cancel.tsx      # Payment cancellation page
├── App.tsx            # Main app component with routing
└── main.tsx           # Application entry point
```

## Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayFast Backend URL
VITE_BACKEND_URL=your_backend_url
```

## Tech Stack

### Frontend

- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with dark mode
- **React Router DOM**: Client-side routing
- **Lucide React**: Beautiful, customizable icons
- **React Hot Toast**: Elegant toast notifications

### Backend & Services

- **Supabase**: PostgreSQL database with real-time capabilities
- **Supabase Auth**: Authentication and user management
- **PayFast**: South African payment gateway
- **Row Level Security**: Database-level security policies

### Development Tools

- **ESLint**: Code linting and quality checks
- **TypeScript ESLint**: TypeScript-specific linting rules
- **PostCSS**: CSS processing with Autoprefixer
- **Vitest**: Unit testing
- **Git**: Version control with comprehensive .gitignore

## Performance & Optimization

- **Code Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Unused code elimination
- **Optimized Images**: Efficient image loading and caching
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo for performance
- **Database Indexing**: Optimized database queries with proper indexes

## Security Features

- **Row Level Security**: Database-level access control, restricted to prevent client-side self-activation of subscriptions
- **Authentication Required**: All sensitive operations require authentication
- **CSRF Protection**: Built-in CSRF protection with Supabase
- **SQL Injection Prevention**: Parameterized queries prevent SQL injection
- **XSS Protection**: React's built-in XSS protection
- **Secure Headers**: Proper security headers configuration

## License

MIT
