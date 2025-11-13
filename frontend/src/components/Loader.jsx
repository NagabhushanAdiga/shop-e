import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useStoreSettings } from '../context/StoreSettingsContext';

const Loader = ({ message = 'Loading...', fullScreen = true, size = 60 }) => {
  const { storeSettings } = useStoreSettings();
  
  const loaderColor = storeSettings?.loaderColor || storeSettings?.primaryColor || '#667eea';

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: loaderColor,
              mb: 2,
            }}
          />
        </motion.div>
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {message}
            </Typography>
          </motion.div>
        )}
      </Box>
    );
  }

  // Inline loader
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: loaderColor,
          mb: message ? 2 : 0,
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;

