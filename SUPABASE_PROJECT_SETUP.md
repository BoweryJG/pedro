# Supabase Project Setup Guide for Booking System

This guide provides comprehensive instructions for setting up a Supabase project specifically tailored for a booking system application.

## Table of Contents
1. [Creating a New Supabase Project](#1-creating-a-new-supabase-project)
2. [Obtaining Project URL and API Keys](#2-obtaining-project-url-and-api-keys)
3. [Authentication Configuration](#3-authentication-configuration)
4. [Database Setup Requirements](#4-database-setup-requirements)
5. [Security Best Practices](#5-security-best-practices)
6. [Email Authentication Setup](#6-email-authentication-setup)

## 1. Creating a New Supabase Project

### Prerequisites
- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A GitHub account (for authentication)

### Step-by-Step Instructions

1. **Log in to Supabase Dashboard**
   - Navigate to [app.supabase.com](https://app.supabase.com)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click the "New Project" button
   - Select your organization or create a new one
   - Fill in the project details:
     - **Name**: Choose a descriptive name (e.g., "booking-system-prod")
     - **Database Password**: Generate a strong password (save this securely!)
     - **Region**: Select the closest region to your users
     - **Pricing Plan**: Choose based on your needs (Free tier is good for development)

3. **Wait for Project Initialization**
   - Project creation typically takes 2-3 minutes
   - You'll receive an email when it's ready

## 2. Obtaining Project URL and API Keys

### Locating Your Credentials

1. **Navigate to Project Settings**
   - In your project dashboard, click on "Settings" (gear icon)
   - Select "API" from the sidebar

2. **Copy Essential Credentials**
   ```
   Project URL: https://[YOUR-PROJECT-REF].supabase.co
   Anon/Public Key: eyJhbGciOiJS... (safe for client-side)
   Service Role Key: eyJhbGciOiJS... (server-side only!)
   ```

3. **Environment Variables Setup**
   Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   **⚠️ Important**: Never commit the service role key to version control!

## 3. Authentication Configuration

### Enable Authentication Providers

1. **Navigate to Authentication Settings**
   - Go to "Authentication" → "Providers" in the dashboard

2. **Configure Email Provider** (Recommended for booking systems)
   - Toggle "Enable Email Signup"
   - Configure email settings:
     - Confirm email: ON (recommended)
     - Secure email change: ON
     - Secure password change: ON

3. **Optional: Social Providers**
   For easier user onboarding, consider enabling:
   - Google OAuth
   - Apple Sign In
   - Facebook Login

   Each provider requires:
   - Client ID
   - Client Secret
   - Redirect URLs configuration

### Authentication Settings

1. **Site URL Configuration**
   - Go to "Authentication" → "URL Configuration"
   - Set your production URL: `https://yourdomain.com`
   - Add redirect URLs for local development: `http://localhost:3000/**`

2. **JWT Settings**
   - JWT expiry: 3600 (1 hour) for security
   - Enable JWT Auto Refresh

## 4. Database Setup Requirements

### Essential Tables for Booking System

1. **Create Core Tables**
   Navigate to "SQL Editor" and run:

   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Users profile table (extends auth.users)
   CREATE TABLE public.profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     full_name TEXT,
     phone TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );

   -- Services/Resources table
   CREATE TABLE public.services (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     duration_minutes INTEGER NOT NULL,
     price DECIMAL(10,2),
     active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );

   -- Bookings table
   CREATE TABLE public.bookings (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     service_id UUID REFERENCES public.services(id) NOT NULL,
     booking_date DATE NOT NULL,
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );

   -- Availability/Schedule table
   CREATE TABLE public.availability (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     service_id UUID REFERENCES public.services(id),
     day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   );
   ```

2. **Create Indexes for Performance**
   ```sql
   -- Index for faster booking queries
   CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
   CREATE INDEX idx_bookings_user ON public.bookings(user_id);
   CREATE INDEX idx_bookings_service ON public.bookings(service_id);
   CREATE INDEX idx_availability_service ON public.availability(service_id);
   ```

3. **Set Up Triggers**
   ```sql
   -- Auto-update updated_at timestamp
   CREATE OR REPLACE FUNCTION public.handle_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = TIMEZONE('utc'::text, NOW());
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER set_updated_at_profiles
     BEFORE UPDATE ON public.profiles
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_updated_at();

   CREATE TRIGGER set_updated_at_bookings
     BEFORE UPDATE ON public.bookings
     FOR EACH ROW
     EXECUTE FUNCTION public.handle_updated_at();
   ```

## 5. Security Best Practices

### Row Level Security (RLS)

1. **Enable RLS on All Tables**
   ```sql
   -- Enable RLS
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
   ```

2. **Create Security Policies**
   ```sql
   -- Profiles: Users can only view/edit their own profile
   CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Services: Everyone can view, only admins can modify
   CREATE POLICY "Anyone can view services" ON public.services
     FOR SELECT USING (true);

   -- Bookings: Users can view/edit their own bookings
   CREATE POLICY "Users can view own bookings" ON public.bookings
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can create own bookings" ON public.bookings
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own bookings" ON public.bookings
     FOR UPDATE USING (auth.uid() = user_id);

   -- Availability: Everyone can view
   CREATE POLICY "Anyone can view availability" ON public.availability
     FOR SELECT USING (true);
   ```

### API Security

1. **Configure API Settings**
   - Use API key restrictions in production
   - Enable rate limiting
   - Configure CORS properly

2. **Environment-Specific Keys**
   - Development: Use anon key with RLS
   - Production: Implement server-side API routes with service role key
   - Never expose service role key to client

3. **Additional Security Measures**
   ```sql
   -- Create admin role
   CREATE ROLE booking_admin;

   -- Function to check if user is admin
   CREATE OR REPLACE FUNCTION public.is_admin()
   RETURNS BOOLEAN AS $$
   BEGIN
     RETURN EXISTS (
       SELECT 1 FROM auth.users
       WHERE id = auth.uid()
       AND raw_user_meta_data->>'role' = 'admin'
     );
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

## 6. Email Authentication Setup

### Configure Email Templates

1. **Navigate to Email Templates**
   - Go to "Authentication" → "Email Templates"

2. **Customize Templates for Booking System**

   **Confirmation Email**:
   ```html
   <h2>Welcome to [Your Booking System Name]!</h2>
   <p>Thanks for signing up. Please confirm your email address by clicking the link below:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   <p>This link will expire in 24 hours.</p>
   <p>If you didn't create an account, you can safely ignore this email.</p>
   ```

   **Password Reset Email**:
   ```html
   <h2>Reset Your Password</h2>
   <p>We received a request to reset your password. Click the link below to create a new password:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   <p>This link will expire in 1 hour.</p>
   <p>If you didn't request this, please ignore this email.</p>
   ```

   **Magic Link Email**:
   ```html
   <h2>Your Login Link</h2>
   <p>Click the link below to log in to your account:</p>
   <p><a href="{{ .ConfirmationURL }}">Log In</a></p>
   <p>This link will expire in 1 hour and can only be used once.</p>
   ```

3. **SMTP Configuration** (for production)
   - Go to "Settings" → "SMTP Settings"
   - Configure with your email provider:
     ```
     Host: smtp.sendgrid.net (example)
     Port: 587
     Username: apikey
     Password: your-sendgrid-api-key
     Sender email: noreply@yourdomain.com
     Sender name: Your Booking System
     ```

### Email Verification Flow

1. **Enable Double Opt-in**
   - Ensures users verify their email
   - Reduces spam registrations
   - Improves deliverability

2. **Configure Redirect URLs**
   ```javascript
   // In your app configuration
   const supabase = createClient(url, key, {
     auth: {
       redirectTo: 'https://yourdomain.com/auth/callback'
     }
   })
   ```

3. **Handle Email Verification in Your App**
   ```javascript
   // Example verification handler
   useEffect(() => {
     const { data: authListener } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         if (event === 'SIGNED_IN') {
           // Check if email is verified
           if (!session?.user?.email_confirmed_at) {
             // Redirect to verification pending page
             router.push('/verify-email')
           }
         }
       }
     )
     return () => {
       authListener.subscription.unsubscribe()
     }
   }, [])
   ```

## Testing Your Setup

1. **Test Authentication Flow**
   - Sign up with email
   - Verify email confirmation works
   - Test password reset
   - Test social logins (if configured)

2. **Test Database Access**
   ```javascript
   // Test query
   const { data, error } = await supabase
     .from('services')
     .select('*')
   
   if (error) console.error('Error:', error)
   else console.log('Services:', data)
   ```

3. **Verify RLS Policies**
   - Try accessing data as authenticated user
   - Try accessing data as unauthenticated user
   - Verify users can only see their own data

## Troubleshooting Common Issues

1. **CORS Errors**
   - Add your domain to allowed URLs in Authentication settings
   - Check API settings for proper CORS configuration

2. **Email Not Sending**
   - In development, check email logs in dashboard
   - In production, verify SMTP settings
   - Check spam folders

3. **RLS Blocking Access**
   - Verify user is authenticated
   - Check policy conditions
   - Use SQL Editor to debug policies

## Next Steps

1. Set up real-time subscriptions for live booking updates
2. Implement webhook handlers for booking confirmations
3. Configure backup strategies
4. Set up monitoring and alerts
5. Plan for scaling (connection pooling, read replicas)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [SQL Editor Best Practices](https://supabase.com/docs/guides/database/sql-editor)
- [Authentication Deep Dive](https://supabase.com/docs/guides/auth)

---

Remember to always follow the principle of least privilege and regularly audit your security settings. Keep your Supabase CLI and libraries updated to the latest versions for security patches and new features.