# Greg Pedro Backend

This repository contains the backend code for Dr. Greg Pedro's dental practice, featuring advanced Yomi robotic technology for dental implant procedures.

## Overview

This backend is built using Supabase and deployed on Render. It provides:

- Authentication and user management
- Database for patient records, appointments, and services 
- API endpoints for Yomi technology features
- Integration with the React frontend

## Tech Stack

- **Supabase**: For authentication, database, and serverless functions
- **PostgreSQL**: Database for storing all dental practice data
- **Deno Edge Functions**: For handling API requests
- **Render**: For deployment and hosting

## Database Schema

The database includes tables for:

- **Patients**: User profiles and medical information
- **Services**: Dental procedures including Yomi-assisted services
- **Appointments**: Scheduling and management
- **Staff**: Dentists and dental personnel profiles
- **Testimonials**: Patient reviews and feedback
- **Yomi Features**: Information about Yomi robotic technology

## Features

- **Authentication**: Secure login/signup process
- **Appointment Management**: Book, cancel, and manage appointments
- **Patient Portal**: Access to medical records and appointment history
- **Yomi Technology Information**: Details about dental implant procedures using Yomi
- **Row-Level Security (RLS)**: Ensures patient data privacy and security

## API Endpoints

### Authentication
- `/auth/signup`: Create new user and patient record
- `/auth/signin`: Authenticate with email and password
- `/auth/signout`: End user session
- `/auth/reset`: Request password reset
- `/auth/update`: Update user information
- `/auth/user`: Get current user information

### Appointments
- GET `/appointments/upcoming`: View upcoming appointments
- GET `/appointments/history`: View past appointments
- GET `/appointments/:id`: View specific appointment details
- POST `/appointments`: Create new appointment
- PUT `/appointments/:id`: Update appointment details
- DELETE `/appointments/:id`: Cancel appointment

### Services and Info
- GET `/services/services`: List all dental services
- GET `/services/yomi-features`: Get Yomi technology information
- GET `/services/staff`: Get dental practice staff information
- GET `/services/testimonials`: Get approved patient testimonials
- GET `/services/:id`: Get specific service details

## Local Development Setup

1. **Install dependencies**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   ```

2. **Start local Supabase instance**
   ```bash
   supabase start
   ```

3. **Apply migrations**
   ```bash
   supabase db push
   ```

4. **Seed database with initial data**
   ```bash
   supabase db exec -f supabase/seed/seed_data.sql
   ```

5. **Serve functions locally**
   ```bash
   supabase functions serve
   ```

## Deployment

This backend is deployed on Render at:
- https://pedrobackend.onrender.com

Current deployment status: Rebuilding (May 21, 2025)

To deploy changes:
1. Push to the main branch of this repository
2. Render will automatically deploy the changes

## Environment Variables

- `SUPABASE_URL`: URL of the Supabase project
- `SUPABASE_ANON_KEY`: Anonymous API key for Supabase
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name

## Security

- All routes use proper authentication
- Row-Level Security (RLS) is implemented to protect patient data
- Patient data is only accessible by the patient themselves
- Service and staff information are publicly accessible

## Connecting with Frontend

The frontend React application is designed to communicate with this backend via API calls. The frontend is deployed separately and configured to use this backend's endpoints.

## Contributing

Guidelines for contributing to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary software for Dr. Greg Pedro's dental practice.
