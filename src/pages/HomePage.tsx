import { useState } from 'react';
import { Alert } from '@mui/material';
import FableForm from '../components/FableForm';
import FableResult from '../components/FableResult';

const HomePage: React.FC = () => {
  const [fableText, setFableText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleFableGenerated = (text: string, imgUrls: string[]) => {
    setFableText(text);
    setImages(imgUrls);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      <FableForm
        onFableGenerated={handleFableGenerated}
        onError={handleError}
      />
      <FableResult fableText={fableText} images={images} />
    </div>
  );
};

export default HomePage; 