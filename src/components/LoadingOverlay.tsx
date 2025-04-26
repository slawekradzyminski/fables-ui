import { Backdrop, CircularProgress } from '@mui/material';

interface Props {
  loading: boolean;
}

export default function LoadingOverlay({ loading }: Props) {
  return (
    <Backdrop
      open={loading}
      sx={{ zIndex: theme => theme.zIndex.modal + 1, color: 'primary.main' }}
      data-testid="loading-overlay"
    >
      <CircularProgress size={80} thickness={4} />
    </Backdrop>
  );
} 