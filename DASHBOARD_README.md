# Dr. Pedro's Luxury Practice Dashboard

## 🎯 Overview

A Breitling-inspired luxury dashboard for Dr. Pedro's dental practice, featuring real-time analytics, schedule management, and subdomain-specific metrics. This dashboard transforms practice data into an elegant timepiece experience.

## 🚀 Features

### Watch Dashboard
- **Breitling Chronomat Design**: Luxury watch interface displaying real-time metrics
- **Interactive Complications**: Click to switch between data views
- **Real-time Updates**: Live data from Supabase
- **4 Data Modes**: Appointments, Patients, Services, Performance

### Schedule Management
- **Daily Schedule View**: Hour-by-hour appointment visualization
- **Weekly Overview**: Week at a glance with color-coded appointments
- **Drag & Drop**: Reschedule appointments with ease
- **Staff Scheduler**: Manage team schedules and availability
- **Quick Actions**: Call, SMS, and email patients directly

### Analytics Engine
- **Real-time Metrics**: Production, collections, patient flow
- **Predictive Analytics**: ML-based scheduling optimization
- **Industry Benchmarks**: Compare against dental industry standards
- **Automated Insights**: AI-generated recommendations

### Subdomain Dashboards
- **TMJ**: Pain tracking, treatment progress, compliance monitoring
- **Implants**: Success rates, healing timelines, case tracking
- **Robotic (Yomi)**: Precision metrics, efficiency comparisons
- **MedSpa**: Treatment packages, client satisfaction scores

## 🔐 Authentication

The dashboard uses Google Sign-In with Supabase Auth for secure access.

### Setting Up Google OAuth

1. **In Supabase Dashboard**:
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `https://yourdomain.com/dr-pedro/dashboard`

2. **Configure Authorized Users**:
   - Add authorized emails to `.env.local`:
   ```env
   VITE_AUTHORIZED_EMAILS=drpedro@gregpedromd.com,admin@gregpedromd.com
   ```

3. **Google Cloud Console Setup**:
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Configure consent screen

## 📍 Access Points

- **Login**: `/dr-pedro/login`
- **Dashboard**: `/dr-pedro/dashboard` (protected)
- **Unauthorized**: `/dr-pedro/unauthorized`

## 🗄️ Database Schema

The dashboard uses these Supabase tables:

- `appointments`: Appointment scheduling and tracking
- `patients`: Patient demographics and history
- `treatments`: Service catalog with pricing
- `financial_transactions`: Payment tracking
- `staff_schedules`: Team availability
- `practice_metrics`: KPI storage
- `subdomain_analytics`: Specialty-specific metrics
- `treatment_plans`: Multi-visit treatment tracking
- `inventory`: Supply management

## 🎨 Design Philosophy

The dashboard embraces luxury watch aesthetics:

- **Metallic Gradients**: Premium finishes
- **Smooth Animations**: Framer Motion transitions
- **Glass Morphism**: Translucent overlays
- **Precision Typography**: Clean, readable fonts
- **Interactive Elements**: Hover effects and transformations

## 📊 Key Metrics Tracked

### Financial
- Daily/Monthly Production
- Collection Rate (target: 98%+)
- Case Acceptance Rate
- Average Production per Patient

### Operational
- Chair Utilization Rate
- Staff Productivity
- No-Show/Cancellation Rate
- Schedule Fill Rate

### Patient
- New Patient Flow
- Retention Rate
- Satisfaction Scores
- Referral Sources

## 🚀 Deployment

1. **Environment Variables**:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_AUTHORIZED_EMAILS=authorized_emails
   ```

2. **Build Command**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify/Vercel**:
   - Set environment variables
   - Configure redirect rules
   - Enable SPA routing

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Mobile Optimization

The dashboard is fully responsive with:
- Touch-optimized controls
- Mobile-friendly navigation
- Adaptive layouts
- Performance optimizations

## 🏆 Award-Winning Features

1. **Watch Complications**: Each subdomain gets its own watch complication
2. **Time-Based Intelligence**: Predictive scheduling algorithms
3. **Luxury Experience**: Sound effects and haptic feedback ready
4. **Real-time Sync**: WebSocket connections for live updates

## 📞 Support

For dashboard access or technical support:
- Email: drpedro@gregpedromd.com
- Phone: (929) 242-4535

---

*"Where others have dashboards, Dr. Pedro has a Patek Philippe"*