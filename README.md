# Policy Impact Calculator

A sophisticated Policy Impact Calculator that transforms complex legislative analysis into an engaging, user-friendly AI-powered experience for understanding policy changes.

## Features

- **Interactive Policy Analysis**: Multi-step questionnaire to gather user demographics and preferences
- **Real-time Impact Calculations**: Personalized financial impact analysis based on user profile
- **Comparative Scenarios**: Standard policy vs "One Big Beautiful Bill" comparisons
- **Visual Data Presentation**: Charts and graphs showing financial impacts over time
- **Responsive Design**: Modern UI with glassmorphism effects and dark/light theme support

## Technologies Used

- **Frontend**: React.js with TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
├── shared/                # Shared types and schemas
└── migrations/            # Database migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rajesh77054/Policy-Impact-Calculator.git
cd Policy-Impact-Calculator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database configuration will be provided by Replit
DATABASE_URL=your_postgresql_connection_string
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. **Start Assessment**: Begin with basic demographic information
2. **Complete Profile**: Answer questions about employment, family status, and priorities
3. **View Results**: See personalized policy impact calculations
4. **Compare Scenarios**: Review standard vs comprehensive policy packages
5. **Explore Data**: Interact with charts and detailed breakdowns

## API Endpoints

- `POST /api/session` - Create new user session
- `POST /api/session/form-data` - Update user profile data
- `POST /api/calculate` - Calculate policy impacts
- `GET /api/results` - Retrieve calculation results
- `GET /api/methodology` - Get data sources and methodology

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.