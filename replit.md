# Policy Impact Calculator

## Overview

The Policy Impact Calculator is a full-stack web application that provides personalized policy impact analysis for users. It features a React frontend with TypeScript, an Express backend, and PostgreSQL database integration using Drizzle ORM. The application guides users through a multi-step questionnaire to gather demographic and financial information, then calculates and displays personalized policy impacts across various categories including taxes, healthcare, energy costs, and economic indicators.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom utility classes and Radix UI components
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Chart.js for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **API Integration**: Federal Reserve Economic Data (FRED) and Bureau of Labor Statistics (BLS) APIs
- **File Processing**: Excel/CSV parsing for policy data analysis

### Database Schema
- **user_sessions**: Stores temporary session data including form responses and calculated results
- Sessions are identified by unique session IDs
- Form data and results are stored as JSON objects
- Automatic timestamp tracking for session creation

## Key Components

### Form Steps System
1. **Location Step**: State and ZIP code collection for regional calculations
2. **Demographics Step**: Age, family status, and dependent information
3. **Employment Step**: Employment status and industry classification
4. **Healthcare Step**: Insurance type and HSA status
5. **Income Step**: Income range selection aligned with IRS tax brackets
6. **Priorities Step**: User policy preferences

### Policy Calculation Engine
- Real-time tax impact calculations using current IRS tax brackets
- Healthcare cost analysis based on KFF data
- State-specific adjustments for taxes and cost of living
- Economic indicator integration (unemployment, recession probability)
- Timeline projections with purchasing power adjustments

### Results Dashboard
- Interactive charts showing policy impacts over time
- Comparative analysis between current law and proposed policies
- Economic context cards with real-time indicators
- Detailed breakdowns by policy category

## Data Flow

1. **Session Creation**: User starts calculator, server creates unique session ID
2. **Form Collection**: Multi-step form collects user demographics and preferences
3. **Real-time Validation**: Client-side validation with server-side verification
4. **Policy Calculation**: Server processes form data through calculation engine
5. **API Integration**: External APIs provide economic context and validation
6. **Results Generation**: Comprehensive impact analysis with visualizations
7. **Session Storage**: Results stored temporarily in database with session ID

## External Dependencies

### Government Data Sources
- **IRS**: Tax brackets, standard deductions, and tax calculation methodologies
- **Bureau of Labor Statistics**: Employment data and Consumer Price Index
- **Federal Reserve Economic Data**: Economic indicators and macroeconomic data
- **Kaiser Family Foundation**: Healthcare cost data and insurance statistics
- **Congressional Budget Office**: Policy impact analysis and budget projections

### Third-party Services
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Radix UI**: Accessible component primitives
- **Chart.js**: Data visualization library
- **Zod**: Runtime type validation

## Deployment Strategy

- **Platform**: Replit with autoscale deployment target
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend
- **Environment**: Node.js 20 runtime with PostgreSQL 16 module
- **Port Configuration**: Internal port 5000 mapped to external port 80
- **Static Assets**: Served from `attached_assets` directory for policy-related documents

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 27, 2025. Enhanced results dashboard with progressive disclosure UX - implemented collapsible "View Personalized Side-by-Side Comparison" section to provide detailed breakdowns without overwhelming main results flow
- June 24, 2025. Initial setup