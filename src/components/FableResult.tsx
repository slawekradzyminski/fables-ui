import { 
  Typography, 
  Card, 
  CardMedia, 
  Paper, 
  Box,
  Divider,
} from '@mui/material';
// Import the interleave utility and API types
import { interleave } from '../utils/interleaveImages';
import { IllustrationResponse } from '../api/fablesApi'; 

// Update props interface
interface FableResultProps {
  title: string;
  fableText: string;
  moral: string;
  illustrations: IllustrationResponse[];
}

const FableResult: React.FC<FableResultProps> = ({ title, fableText, moral, illustrations }) => {
  if (!fableText) return null;

  // Generate interleaved content
  const content = interleave(fableText, illustrations);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h2" color="primary" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      
      <Divider sx={{ my: { xs: 2, sm: 3 } }} />
      
      {/* Render interleaved content */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        {content.map((item, index) => {
          if (item.type === 'text') {
            return (
              <Typography 
                key={`text-${index}`}
                variant="body1" 
                paragraph 
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: '1.1rem', // Slightly smaller for better density with images
                  fontFamily: '"Georgia", serif',
                  textAlign: 'justify',
                  mb: 2, // Margin between paragraphs/images
                  px: { xs: 1, sm: 2 } // Horizontal padding
                }}
              >
                {item.value}
              </Typography>
            );
          } else { // item.type === 'img'
            return (
              <Box key={`img-${index}`} sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    maxWidth: '80%', // Control image width
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`data:image/png;base64,${item.value.image}`}
                    alt={item.value.prompt} // Use prompt for alt text
                    sx={{ 
                      objectFit: 'contain', // Changed to contain to see full image
                      maxHeight: '500px' // Limit image height
                    }}
                  />
                  {/* Optional: Display prompt as caption */}
                  {/* <CardContent sx={{ bgcolor: 'grey.100' }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.value.prompt}
                    </Typography>
                  </CardContent> */} 
                </Card>
              </Box>
            );
          }
        })}
      </Box>

      {/* Display Moral */}
      {moral && (
        <>
          <Divider sx={{ my: { xs: 2, sm: 3 } }} />
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              mt: 3,
              bgcolor: 'secondary.light', // Use secondary color palette
              color: 'secondary.contrastText',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'secondary.main'
            }}
          >
            <Typography variant="h6" component="h3" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
              Moral of the Story
            </Typography>
            <Typography variant="body1" align="center" sx={{ fontStyle: 'italic' }}>
              {moral}
            </Typography>
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default FableResult; 