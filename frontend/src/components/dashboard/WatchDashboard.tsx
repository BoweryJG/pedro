import React, { useState } from 'react';
import { Box, Card, Typography, IconButton, Tooltip, Fab, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Psychology,
  MedicalServices,
  PrecisionManufacturing,
  Spa,
  Close,
  SwapHoriz,
  QueryStats
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TMJDashboard, ImplantsDashboard, RoboticDashboard, MedSpaDashboard } from './subdomains';

interface DashboardModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  color: string;
}

const WatchDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const modules: DashboardModule[] = [
    {
      id: 'tmj',
      name: 'TMJ Analytics',
      icon: <Psychology />,
      component: TMJDashboard,
      color: '#667eea'
    },
    {
      id: 'implants',
      name: 'Implant Center',
      icon: <MedicalServices />,
      component: ImplantsDashboard,
      color: '#764ba2'
    },
    {
      id: 'robotic',
      name: 'Yomi Robotic',
      icon: <PrecisionManufacturing />,
      component: RoboticDashboard,
      color: '#00F5FF'
    },
    {
      id: 'medspa',
      name: 'MedSpa Analytics',
      icon: <Spa />,
      component: MedSpaDashboard,
      color: '#f093fb'
    }
  ];

  const OverviewDashboard = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Practice Overview Dashboard
      </Typography>

      {/* Watch Face Design */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 4,
        position: 'relative'
      }}>
        <Box
          sx={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '8px solid #2a2a2a',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '95%',
              height: '95%',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.1)',
            }
          }}
        >
          {/* Watch Complications */}
          {modules.map((module, index) => {
            const angle = (index * 90) - 90; // Position at 12, 3, 6, 9 o'clock
            const radius = 140;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            return (
              <motion.div
                key={module.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tooltip title={module.name}>
                  <IconButton
                    onClick={() => setActiveModule(module.id)}
                    sx={{
                      width: 80,
                      height: 80,
                      background: `linear-gradient(145deg, ${module.color}22, ${module.color}44)`,
                      border: `2px solid ${module.color}66`,
                      color: module.color,
                      boxShadow: `0 5px 15px ${module.color}44`,
                      '&:hover': {
                        background: `linear-gradient(145deg, ${module.color}44, ${module.color}66)`,
                        boxShadow: `0 10px 25px ${module.color}66`
                      }
                    }}
                  >
                    {module.icon}
                  </IconButton>
                </Tooltip>
              </motion.div>
            );
          })}

          {/* Center Display */}
          <Box sx={{ textAlign: 'center', zIndex: 1 }}>
            <Typography variant="h2" sx={{ 
              color: '#fff', 
              fontWeight: 'bold',
              fontFamily: 'var(--font-secondary)',
              letterSpacing: '-0.02em'
            }}>
              98.5%
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.8rem'
            }}>
              Overall Performance
            </Typography>
          </Box>

          {/* Watch Crown */}
          <Box
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 30,
              height: 60,
              background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a)',
              borderRadius: '0 15px 15px 0',
              boxShadow: '5px 0 10px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SwapHoriz sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={3} key={module.id}>
            <motion.div whileHover={{ y: -5 }}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${module.color}22, ${module.color}11)`,
                border: `1px solid ${module.color}44`,
                p: 2,
                cursor: 'pointer'
              }}
              onClick={() => setActiveModule(module.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: module.color }}>
                    {module.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      {module.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      View Analytics →
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const ActiveComponent = activeModule === 'overview' 
    ? OverviewDashboard 
    : modules.find(m => m.id === activeModule)?.component || OverviewDashboard;

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative' }}>
      {/* Module Switcher FAB */}
      <Fab
        color="primary"
        aria-label="switch module"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          zIndex: 1000
        }}
      >
        <DashboardIcon />
      </Fab>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>

      {/* Module Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
            borderLeft: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Dashboard Modules
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#fff' }}>
              <Close />
            </IconButton>
          </Box>
          
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeModule === 'overview'}
                onClick={() => {
                  setActiveModule('overview');
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    background: 'rgba(102, 126, 234, 0.2)',
                    borderLeft: '4px solid #667eea'
                  }
                }}
              >
                <ListItemIcon>
                  <QueryStats sx={{ color: '#667eea' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Overview" 
                  secondary="Practice-wide metrics"
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
                />
              </ListItemButton>
            </ListItem>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            
            {modules.map((module) => (
              <ListItem key={module.id} disablePadding>
                <ListItemButton
                  selected={activeModule === module.id}
                  onClick={() => {
                    setActiveModule(module.id);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      background: `${module.color}22`,
                      borderLeft: `4px solid ${module.color}`
                    }
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ color: module.color }}>
                      {module.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={module.name}
                    secondary="Specialized analytics"
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default WatchDashboard;