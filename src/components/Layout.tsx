import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Box, AppBar, Toolbar, Typography } from '@mui/material';

// Custom theme with better colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1', // Modern indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#F59E0B', // Warm amber
      light: '#FBBF24',
      dark: '#D97706',
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6366F1 0%, #818CF8 100%)',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4F46E5 0%, #6366F1 100%)',
            boxShadow: '0 6px 20px 0 rgba(99, 102, 241, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366F1',
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          width: '100%',
        }}
      >
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <Container 
            maxWidth="lg"
            sx={{
              width: '100%',
            }}
          >
            <Toolbar 
              disableGutters 
              sx={{ 
                height: 72,
                px: { xs: 2, sm: 3 },
              }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: '1.5rem',
                  background: 'linear-gradient(45deg, #6366F1 0%, #818CF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Fable Generator
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
          }}
        >
          <Container 
            maxWidth="lg"
            sx={{
              width: '100%',
              py: { xs: 3, sm: 4 },
              px: { xs: 2, sm: 3 },
            }}
            data-testid="parent-container"
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
              }}
              data-testid="centered-container"
            >
              {children}
            </Box>
          </Container>
        </Box>

        <Box 
          component="footer" 
          sx={{ 
            py: 3,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            width: '100%',
          }}
        >
          <Container 
            maxWidth="lg"
            sx={{
              width: '100%',
            }}
          >
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                color: 'text.secondary',
              }}
            >
              © {new Date().getFullYear()} Fable Generator • Create magical stories for children
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 