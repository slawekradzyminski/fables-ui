import { useState } from 'react';
import { Alert, Box } from '@mui/material';
import { FableResponse, IllustrationResponse } from '../api/fablesApi';
import FableForm from '../components/FableForm';
import FableResult from '../components/FableResult';
import LoadingOverlay from '../components/LoadingOverlay';

const HomePage: React.FC = () => {
  const [fable, setFable] = useState('');
  const [moral, setMoral] = useState('');
  const [illustrations, setIllustrations] = useState<IllustrationResponse[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFableGenerated = (response: FableResponse) => {
    setFable(response.fable);
    setMoral(response.moral);
    setIllustrations(response.illustrations);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div>
      <LoadingOverlay loading={loading} />
      {error && (
        <Box mb={3}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Box>
      )}
      <Box mb={4}>
        <FableForm
          onFableGenerated={handleFableGenerated}
          onError={handleError}
          onLoadingChange={setLoading}
        />
      </Box>
      <FableResult 
        fableText={fable} 
        moral={moral} 
        illustrations={illustrations} 
      />
    </div>
  );
};

export default HomePage; 