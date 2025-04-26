import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Box,
  InputAdornment,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { generateFable, FableResponse } from '../api/fablesApi';

interface FableFormProps {
  onFableGenerated: (fable: FableResponse) => void;
  onError: (errorMessage: string) => void;
  onLoadingChange: (flag: boolean) => void;
}

const FableForm: React.FC<FableFormProps> = ({ onFableGenerated, onError, onLoadingChange }) => {
  const [worldDescription, setWorldDescription] = useState('');
  const [mainCharacter, setMainCharacter] = useState('');
  const [age, setAge] = useState(7);
  const [numImages, setNumImages] = useState(2);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange(true);
    setIsDisabled(true);

    try {
      const response = await generateFable({
        world_description: worldDescription,
        main_character: mainCharacter,
        age,
        num_images: numImages,
      });
      onFableGenerated(response);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error generating fable.');
    } finally {
      onLoadingChange(false);
      setIsDisabled(false);
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 3 },
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography 
          variant="h5" 
          align="center"
          sx={{
            background: 'linear-gradient(45deg, #6366F1 0%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Create Your Magical Story
        </Typography>

        <Stack spacing={3} width="100%">
          <TextField
            label="Describe the magical world"
            value={worldDescription}
            onChange={e => setWorldDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            placeholder="A mystical forest where trees whisper ancient secrets..."
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
              }
            }}
          />

          <TextField
            label="Who is your main character?"
            value={mainCharacter}
            onChange={e => setMainCharacter(e.target.value)}
            fullWidth
            required
            placeholder="A brave young dragon learning to fly..."
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
              }
            }}
          />

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <Tooltip title="Choose an age between 1-12 years old" placement="top">
                <TextField
                  label="Target Age"
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  inputProps={{ min: 1, max: 12 }}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFFFF',
                    }
                  }}
                />
              </Tooltip>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <FormControl fullWidth>
                <InputLabel id="num-images-label">Number of Images</InputLabel>
                <Select
                  labelId="num-images-label"
                  label="Number of Images"
                  value={numImages}
                  onChange={e => setNumImages(Number(e.target.value))}
                  sx={{ 
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <MenuItem value={1}>1 image</MenuItem>
                  <MenuItem value={2}>2 images</MenuItem>
                  <MenuItem value={3}>3 images</MenuItem>
                  <MenuItem value={4}>4 images</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            disabled={isDisabled}
            size="large"
            sx={{
              height: 48,
              width: '100%',
              maxWidth: { xs: '100%', sm: '300px' },
              alignSelf: 'center',
              mt: 2,
            }}
          >
            {isDisabled ? 'Creating your story...' : 'Generate Magical Story'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default FableForm; 