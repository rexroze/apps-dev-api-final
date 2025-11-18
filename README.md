# BACKEND STEPS FOR FRESH INSTALLATION
1. npm init -y
2. Starting package npm install: `npm install @prisma/client cookie-parser cors dotenv express jsonwebtoken nodemailer passport passport-github2 passport-google-oauth20 tsconfig-paths`
3. Starting package for npm dev depencies: `npm install --save-dev @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/node @types/nodemailer @types/passport @types/passport-github2 @types/passport-google-oauth20 nodemon prisma ts-node typescript`
4. Setup the package.json for scripts (copy from this code to your code)
5. Add tsconfig.json (this is pre-defined but more likely a configuration for TypeScript rules) - Copy from this code to your code
6. Create the .env file for secret credentials. Follow the .env.example and fill out the variables
7. Setup the Source folder structures (controllers, repositories, routes, services)
8. Setup Prisma ORM
9. Setup PostgreSQL (Choose pgAdmin 4 - PostgreSQL for local development and Neon.com for Cloud/Online Database): 
Local DB Format: `postgresql://{username}:{password}@localhost:5432/{databaseName}?schema=public`
Neon DB Format: `COPY THE CONNECTION STRING FROM NEON.com`
10. Happy Coding!


# QUICK START
`update file: .env.example to .env then fill out the variables`
`npm run db:generate`
`npm run db:migrate`
`npm run dev`


# FEATURES
- Signup Credentials (Email/Password) with Email Verification
- Email Verification Functionality (Verify User Account)
- Resend Email Verification Functionality: If ever the user wasn't able to verify after 24 hours
- Login Credentials (Email/Password) with Access/Refresh Tokens
- Authentication Middleware: Validate Access Token and Refresh Token System
- Role Middleware: Require API Endpoint for a certain restrictions
- Product CRUD with User Tied and Role
- OAuth (Signin using GitHub/Google)