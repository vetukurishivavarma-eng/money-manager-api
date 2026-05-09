# Money Manager - Backend API

A Spring Boot REST API for the Money Manager mobile application with Supabase PostgreSQL database.

## Tech Stack
- **Backend**: Spring Boot 2.7.18, Java 8
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth authentication

### Transactions (Requires JWT Token)
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Add new transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/summary` - Get financial summary

## Deploy to Render (Free Tier)

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Create new repository "money-manager-api"
   - Push this code to GitHub

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: money-manager-api
     - **Region**: Singapore (closest to India)
     - **Branch**: main
     - **Build Command**: `cd backend && ./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar backend/target/backend-1.0.0.jar`
   - Add Environment Variables:
     - `DATABASE_URL`: `postgresql://postgres.mlpleqpoaxdexeprceqm:Shivapoojitha@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require`
     - `DDL_AUTO`: `update`
     - `JWT_SECRET`: (generate a random 64+ char string)

3. **Update Mobile App**
   - After deployment, update `src/services/api.ts` in the mobile app:
   - Change API_URL from `http://192.168.0.106:8080/api` to your Render URL (e.g., `https://money-manager-api.onrender.com/api`)

## Alternative: Railway or Fly.io

Same steps apply - connect GitHub repo, set environment variables, deploy.

## Local Development

```bash
cd backend
./mvnw spring-boot:run
# Server runs on http://localhost:8080
```
