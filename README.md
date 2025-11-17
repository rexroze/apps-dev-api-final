# BACKEND STEPS FOR FRESH INSTALLATION
1. npm init -y
2. Starting package npm install: `npm install express @prisma/client cors dotenv tsconfig-paths`
3. Starting package for npm dev depencies: `npm install -D prisma typescript ts-node nodemon @types/express @types/node @types/cors @types/node`
4. Setup the package.json for scripts (copy from this code to your code)
5. Add tsconfig.json (this is pre-defined but more likely a configuration for TypeScript rules) - Copy from this code to your code
6. Create the .env file for secret credentials. Follow the .env.example and fill out the variables
7. Setup the Source folder structures (controllers, repositories, routes, services)
8. Setup Prisma ORM
9. Setup PostgreSQL (Choose pgAdmin 4 - PostgreSQL for local development and Neon for Cloud/Online Database): `postgresql://{username}:{password}@localhost:5432/{databaseName}?schema=public`
10. Happy Coding!


# QUICK START
`npm run dev`


# FEATURES
- Signup Credentials (Email/Password) with Email Verification
- Email Verification Functionality (Verify User Account)
- Resend Email Verification Functionality: If ever the user wasn't able to verify after 24 hours
- Login Credentials (Email/Password) with Access/Refresh Tokens
- Authentication Middleware: Validate Access Token and Refresh Token System
- Role Middleware: Require API Endpoint for a certain restrictions
- Product CRUD with User Tied and Role