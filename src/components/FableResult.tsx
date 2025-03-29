import { 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  Paper, 
  Box,
  Divider 
} from '@mui/material';

interface FableResultProps {
  fableText: string;
  images: string[];
}

const FableResult: React.FC<FableResultProps> = ({ fableText, images }) => {
  if (!fableText) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" color="primary" sx={{ fontWeight: 600 }}>
          Your Magical Fable
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          A unique story crafted just for you
        </Typography>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            whiteSpace: 'pre-line',
            lineHeight: 2,
            fontSize: '1.25rem',
            fontFamily: '"Georgia", serif',
            textAlign: 'justify',
            mb: 4,
            p: 2
          }}
        >
          {fableText}
        </Typography>
      </Box>

      {images.length > 0 && (
        <>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
              Story Illustrations
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {images.map((imgUrl, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card elevation={0} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="320"
                    image={imgUrl}
                    alt={`Fable illustration ${idx + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Illustration {idx + 1}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default FableResult; 