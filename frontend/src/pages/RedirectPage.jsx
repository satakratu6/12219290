import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { logEvent } from '../logger/logger';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const RedirectPage = ({ token }) => {
  const { code } = useParams();

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${code}`);
        window.location.href = response.data.longUrl;
        logEvent('frontend', 'info', 'page', `Redirected to ${response.data.longUrl}`, token);
      } catch (err) {
        logEvent('frontend', 'error', 'page', 'Redirection failed', token);
      }
    };
    fetchOriginalUrl();
  }, [code, token]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', width: '100%', maxWidth: 400, boxSizing: 'border-box' }}>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Redirecting you to your destination...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If you are not redirected automatically, please check the URL or try again.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RedirectPage;