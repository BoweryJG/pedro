import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Dialog, DialogContent, DialogTitle, Fab, Typography } from '@mui/material';
import { Dashboard, Close } from '@mui/icons-material';
import { TMJDashboard, ImplantsDashboard, RoboticDashboard, MedSpaDashboard } from './subdomains';

interface DashboardIntegrationProps {
  dashboardType: 'tmj' | 'implants' | 'robotic' | 'medspa';
}

/**
 * Dashboard Integration Component
 * 
 * This component can be added to any subdomain page to provide access to the analytics dashboard.
 * It appears as a floating action button that opens the relevant dashboard in a modal.
 * 
 * Usage example in TMJSubdomainPage:
 * 
 * ```tsx
 * import { DashboardIntegration } from '../../components/dashboard';
 * 
 * function TMJSubdomainPage() {
 *   return (
 *     <Box>
 *       {/* ... existing page content ... */}
 *       
 *       {/* Add dashboard integration */}
 *       <DashboardIntegration dashboardType="tmj" />
 *     </Box>
 *   );
 * }
 * ```
 */
export const DashboardIntegration: React.FC<DashboardIntegrationProps> = ({ dashboardType }) => {
  const [open, setOpen] = useState(false);

  const dashboards = {
    tmj: TMJDashboard,
    implants: ImplantsDashboard,
    robotic: RoboticDashboard,
    medspa: MedSpaDashboard
  };

  const DashboardComponent = dashboards[dashboardType];

  return (
    <>
      {/* Floating Dashboard Button */}
      <Tooltip title="View Analytics Dashboard">
        <Fab
          color="primary"
          aria-label="analytics dashboard"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            zIndex: 999,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)'
            }
          }}
        >
          <Dashboard />
        </Fab>
      </Tooltip>

      {/* Dashboard Modal */}
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            background: '#0a0a0a'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>
            Analytics Dashboard
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
            sx={{ color: '#fff' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <DashboardComponent />
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Alternative inline dashboard integration
 * 
 * This version renders the dashboard directly on the page instead of in a modal.
 * Useful for dedicated analytics sections or admin pages.
 * 
 * Usage example:
 * 
 * ```tsx
 * import { InlineDashboard } from '../../components/dashboard';
 * 
 * function AdminPage() {
 *   return (
 *     <Box>
 *       <InlineDashboard dashboardType="tmj" />
 *     </Box>
 *   );
 * }
 * ```
 */
export const InlineDashboard: React.FC<DashboardIntegrationProps> = ({ dashboardType }) => {
  const dashboards = {
    tmj: TMJDashboard,
    implants: ImplantsDashboard,
    robotic: RoboticDashboard,
    medspa: MedSpaDashboard
  };

  const DashboardComponent = dashboards[dashboardType];

  return (
    <Box
      sx={{
        background: '#0a0a0a',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      <DashboardComponent />
    </Box>
  );
};