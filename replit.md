# Policy Impact Calculator

## Overview

The Policy Impact Calculator is a sophisticated web application that transforms complex legislative analysis into an engaging, user-friendly experience for understanding how policy changes affect individuals' finances, healthcare, and future. The application provides personalized financial impact analysis through an interactive multi-step questionnaire and real-time calculations.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with custom glassmorphism effects and dark/light theme support
- **UI Components**: Radix UI components for accessibility and consistency
- **State Management**: React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization and impact charts
- **Forms**: React Hook Form with Zod validation for robust form handling

### Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage for temporary data
- **Build System**: Vite for fast development and optimized production builds
- **Runtime**: Node.js 20 with ESM modules

### Database Design
- **Primary Table**: `user_sessions` stores temporary session data, form responses, and calculated results
- **Data Storage**: JSON columns for flexible form data and policy results storage
- **Session Lifecycle**: Automatic cleanup of expired sessions, no permanent user data storage

## Key Components

### Form System
- **Multi-Step Flow**: 6-step questionnaire covering location, demographics, employment, healthcare, income, and priorities
- **Progressive Enhancement**: Each step builds upon previous responses for personalized calculations
- **Validation**: Zod schemas ensure data integrity and type safety
- **State Persistence**: Form data saved to sessions for recovery and continuation

### Calculation Engine
- **Real-Time Processing**: Policy impact calculations based on authoritative data sources
- **Personalization**: Results tailored to user demographics, location, and financial situation
- **Scenario Comparison**: Standard policy vs "One Big Beautiful Bill" scenario analysis
- **Multi-Dimensional Impact**: Tax, healthcare, energy, and community impact calculations

### Data Sources Integration
- **IRS Tax Data**: Current federal tax brackets and standard deductions
- **Healthcare Costs**: Kaiser Family Foundation employer survey data
- **State-Specific Data**: Tax Foundation state tax rates and cost of living indexes
- **Economic Projections**: Congressional Budget Office methodology and projections

### Results Dashboard
- **Interactive Charts**: Chart.js visualizations showing financial impacts over time
- **Comparative Analysis**: Side-by-side scenario comparisons with toggle functionality
- **Detailed Breakdowns**: Category-specific impact analysis with explanations
- **Timeline Projections**: 5, 10, and 20-year impact forecasts

## Data Flow

1. **Session Initialization**: User starts calculator, server creates unique session ID
2. **Form Collection**: Progressive data collection through 6-step questionnaire
3. **Server Processing**: Real-time calculations using authoritative policy data
4. **Results Generation**: Personalized impact analysis with multiple scenarios
5. **Visualization**: Interactive charts and dashboards for data presentation
6. **Session Cleanup**: Temporary data automatically expired and removed

## External Dependencies

### Production Dependencies
- **Database**: PostgreSQL 16 for persistent data storage
- **Authentication**: Session-based temporary identification (no permanent accounts)
- **UI Library**: Radix UI ecosystem for accessible components
- **Visualization**: Chart.js for interactive data presentation
- **Validation**: Zod for runtime type checking and form validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Fast development server and optimized builds
- **Tailwind CSS**: Utility-first styling with custom design system

## Deployment Strategy

### Replit Configuration
- **Environment**: Node.js 20, PostgreSQL 16, web modules
- **Build Process**: Vite build for frontend, esbuild for backend bundling
- **Port Configuration**: Port 5000 for development, port 80 for production
- **Auto-scaling**: Configured for automatic scaling based on demand

### Production Setup
- **Build Command**: `npm run build` - Creates optimized frontend and backend bundles
- **Start Command**: `npm start` - Runs production server with bundled code
- **Development**: `npm run dev` - Concurrent frontend and backend development servers
- **Database**: Automatic PostgreSQL provisioning with environment variable configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET`: Secure session encryption key
- `NODE_ENV`: Environment configuration (development/production)

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.