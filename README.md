# Backend API

A robust Node.js/Express backend API with authentication, product management, order processing, and OAuth integration.

## 🚀 Features

- **Authentication System**
  - Email/Password signup with email verification
  - JWT-based authentication (Access & Refresh tokens)
  - Email verification functionality
  - Resend email verification
  - OAuth integration (Google & GitHub)

- **Product Management**
  - Full CRUD operations for products
  - Product categories
  - Product images
  - Stock management
  - Product reviews and ratings

- **Order Management**
  - Shopping cart functionality
  - Order processing
  - Order history
  - Payment integration (Xendit)

- **User Management**
  - Role-based access control (USER/ADMIN)
  - User profiles
  - Account management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Passport.js, JWT
- **Email**: Nodemailer
- **Payment**: Xendit

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or cloud-based like Neon)
- npm or yarn

## 🔧 Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root of the `backend` directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   # For Neon: Copy the connection string from your Neon dashboard

   # Server
   PORT=8000
   NODE_ENV=development

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # JWT Secrets
   JWT_ACCESS_SECRET=your_access_token_secret_here
   JWT_REFRESH_SECRET=your_refresh_token_secret_here

   # Email Configuration (for email verification)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   EMAIL_FROM=noreply@yourapp.com

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/v1/google/callback

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/v1/github/callback

   # Xendit Payment (Optional)
   XENDIT_SECRET_KEY=your_xendit_secret_key
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Run database migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:8000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/v1/signup` - User registration
- `POST /api/auth/v1/login` - User login
- `GET /api/auth/v1/verify-email` - Verify email address
- `POST /api/auth/v1/resend-email-verification` - Resend verification email
- `POST /api/auth/v1/refresh-token` - Refresh access token
- `GET /api/auth/v1/google` - Initiate Google OAuth
- `GET /api/auth/v1/google/callback` - Google OAuth callback
- `GET /api/auth/v1/github` - Initiate GitHub OAuth
- `GET /api/auth/v1/github/callback` - GitHub OAuth callback
- `GET /api/auth/v1/oauth/exchange` - Exchange OAuth temp token

### Products
- `GET /api/products` - Get all products (with pagination, search, filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID

### Reviews
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `POST /api/reviews` - Create review

## 🚢 Deployment

### Deploying to Vercel (Serverless)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Vercel**
   - Create a `vercel.json` file in the backend root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Set environment variables in Vercel**
   - Go to your project settings in Vercel dashboard
   - Add all environment variables from your `.env` file
   - **Important**: Update `FRONTEND_URL`, `GOOGLE_CALLBACK_URL`, and `GITHUB_CALLBACK_URL` to your production URLs

4. **Deploy**
   ```bash
   vercel
   ```

### Important Notes for Production

- **Database**: Use a cloud PostgreSQL service (Neon, Supabase, or Railway)
- **CORS**: Update `FRONTEND_URL` to your production frontend URL
- **OAuth Callbacks**: Update OAuth callback URLs in:
  - Google Cloud Console
  - GitHub OAuth App settings
  - Your `.env` file
- **Email**: Use a production email service (SendGrid, Mailgun, etc.)
- **Secrets**: Generate strong, unique secrets for JWT tokens

### Example Production Environment Variables

```env
DATABASE_URL=your_production_database_url
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
JWT_ACCESS_SECRET=your_production_access_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
GOOGLE_CALLBACK_URL=https://your-backend.vercel.app/api/auth/v1/google/callback
GITHUB_CALLBACK_URL=https://your-backend.vercel.app/api/auth/v1/github/callback
# ... other variables
```

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   ├── repositories/          # Database operations
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   │   ├── auth/             # Authentication services
│   │   └── xendit/           # Payment services
│   ├── middleware/           # Express middleware
│   └── server.ts             # Application entry point
├── dist/                      # Compiled JavaScript (production)
├── package.json
└── tsconfig.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS configuration
- Email verification
- Role-based access control
- Secure cookie handling

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC
