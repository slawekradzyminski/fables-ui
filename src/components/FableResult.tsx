import { 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid as Grid2, 
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
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" color="primary">
          Your Magical Fable
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          A unique story crafted just for you
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            whiteSpace: 'pre-line',
            lineHeight: 1.8,
            fontSize: '1.05rem',
            fontFamily: '"Georgia", serif',
            textAlign: 'justify',
            mb: 3 
          }}
        >
          {fableText}
        </Typography>
      </Box>

      {images.length > 0 && (
        <>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" color="primary">
              Story Illustrations
            </Typography>
          </Box>
          
          <Grid2 container spacing={3}>
            {images.map((imgUrl, idx) => (
              <Grid2 size={{ xs: 12, md: 6 }} key={idx}>
                <Card elevation={0} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="240"
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
              </Grid2>
            ))}
          </Grid2>
        </>
      )}
    </Paper>
  );
};

export default FableResult; 