# Dashboard Components Documentation

## Overview

This directory contains specialized dashboard components for Dr. Pedro's dental practice, featuring luxury watch-inspired aesthetics and real-time analytics for each service subdomain.

## Structure

```
dashboard/
├── WatchDashboard.tsx          # Main dashboard with watch face navigation
├── DashboardIntegration.tsx    # Integration helpers for subdomain pages
├── subdomains/                 # Subdomain-specific dashboards
│   ├── TMJDashboard.tsx       # TMJ treatment analytics
│   ├── ImplantsDashboard.tsx  # Implant center metrics
│   ├── RoboticDashboard.tsx   # Yomi robotic precision data
│   └── MedSpaDashboard.tsx    # MedSpa treatment analytics
└── index.ts                    # Exports
```

## Components

### 1. WatchDashboard

The main dashboard featuring a luxury watch face design with complications for each subdomain.

```tsx
import { WatchDashboard } from '@/components/dashboard';

// Use in a page or route
<WatchDashboard />
```

**Features:**
- Central watch face with 4 complications (TMJ, Implants, Robotic, MedSpa)
- Swappable dashboard modules
- Smooth transitions between views
- Floating action button for module switching

### 2. TMJDashboard

Specialized dashboard for TMJ treatment analytics.

**Key Metrics:**
- Pain level tracking with visual timeline
- Treatment compliance percentage
- Patient improvement rates
- Revenue contribution
- Treatment milestone progress

### 3. ImplantsDashboard

Comprehensive implant center analytics.

**Key Metrics:**
- Success rate (osseointegration)
- Procedure efficiency
- Active case monitoring
- Healing timeline visualization
- Revenue per implant analysis

### 4. RoboticDashboard

Yomi robotic system precision metrics.

**Key Metrics:**
- Accuracy measurements vs traditional methods
- Procedure time reduction
- Precision comparison charts
- Real-time procedure tracking
- Efficiency gains visualization

### 5. MedSpaDashboard

MedSpa treatment and client analytics.

**Key Metrics:**
- Treatment package performance
- Client retention rates
- Popular treatment tracking
- Revenue by service
- Client satisfaction scores

## Integration Methods

### Method 1: Floating Dashboard Button

Add a floating button to any subdomain page that opens the dashboard in a modal:

```tsx
import { DashboardIntegration } from '@/components/dashboard';

function TMJSubdomainPage() {
  return (
    <Box>
      {/* Your page content */}
      
      {/* Add dashboard access */}
      <DashboardIntegration dashboardType="tmj" />
    </Box>
  );
}
```

### Method 2: Inline Dashboard

Embed the dashboard directly on a page:

```tsx
import { InlineDashboard } from '@/components/dashboard';

function AdminPage() {
  return (
    <Box>
      <Typography variant="h4">TMJ Analytics</Typography>
      <InlineDashboard dashboardType="tmj" />
    </Box>
  );
}
```

### Method 3: Full Dashboard Route

Create a dedicated route for the complete watch dashboard:

```tsx
// In your router configuration
import { WatchDashboard } from '@/components/dashboard';

<Route path="/admin/dashboard" element={<WatchDashboard />} />
```

## Styling System

All dashboards use the luxury design system with:

- **Color Palette:**
  - TMJ: `#667eea` (Purple gradient)
  - Implants: `#764ba2` (Deep purple)
  - Robotic: `#00F5FF` (Cyan/holographic)
  - MedSpa: `#f093fb` (Pink gradient)

- **Components:**
  - Circular gauge metrics (watch complication style)
  - Glass morphism effects
  - Metallic gradients
  - Smooth animations with Framer Motion

## Data Integration

### Supabase Connection

Each dashboard connects to Supabase for real-time data:

```tsx
const { data: appointments } = await supabase
  .from('appointments')
  .select('*, services(*), patients(*)')
  .eq('services.category', 'tmj')
  .order('appointment_date', { ascending: false });
```

### Mock Data

Currently includes mock data for demonstration. Replace with actual queries:

```tsx
// Example: Replace mock data with real queries
const fetchTMJData = async () => {
  const { data: painTracking } = await supabase
    .from('pain_tracking')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);
    
  // Process and set state
};
```

## Customization

### Adding New Metrics

1. Update the metrics interface:
```tsx
interface CustomMetrics {
  newMetric: number;
  // ... other metrics
}
```

2. Add visualization component:
```tsx
<CircularMetric
  value={metrics.newMetric}
  max={100}
  label="New Metric"
  icon={<CustomIcon />}
  color="#hexcolor"
/>
```

### Creating New Dashboard Modules

1. Create component in `subdomains/`:
```tsx
const NewServiceDashboard: React.FC = () => {
  // Dashboard implementation
};
```

2. Add to WatchDashboard modules:
```tsx
const modules: DashboardModule[] = [
  // ... existing modules
  {
    id: 'newservice',
    name: 'New Service',
    icon: <ServiceIcon />,
    component: NewServiceDashboard,
    color: '#colorhex'
  }
];
```

## Performance Considerations

- Dashboards use React.memo for optimization
- Data fetching occurs on mount with loading states
- Animations use GPU-accelerated transforms
- Large datasets are paginated

## Future Enhancements

1. **Real-time Updates:**
   - WebSocket connections for live data
   - Push notifications for critical metrics

2. **Export Functionality:**
   - PDF reports generation
   - CSV data export

3. **Customizable Widgets:**
   - Drag-and-drop dashboard builder
   - User-specific metric preferences

4. **Mobile Optimization:**
   - Responsive gauge components
   - Touch-friendly interactions

## Dependencies

- Material-UI for base components
- Framer Motion for animations
- Supabase for data fetching
- TypeScript for type safety