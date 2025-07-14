import React, { useEffect, useState } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Snackbar, Alert, Box } from '@mui/material';
import axios from 'axios';
import { logEvent } from '../logger/logger';

const StatsPage = ({ token }) => {
  const [stats, setStats] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStats(response.data);
        setSnackbar({ open: true, message: 'Fetched statistics', severity: 'success' });
        logEvent('frontend', 'info', 'component', 'Fetched statistics', token);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to fetch statistics', severity: 'error' });
        logEvent('frontend', 'error', 'component', 'Failed to fetch statistics', token);
      }
    };
    fetchStats();
  }, [token]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
        URL Stats
      </Typography>
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 900 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Short URL</strong></TableCell>
                <TableCell><strong>Original URL</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Expires</strong></TableCell>
                <TableCell><strong>Clicks</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((url, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.originalUrl}</TableCell>
                  <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(url.expiresAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label={url.clicks} color={url.clicks > 0 ? 'primary' : 'default'} sx={{ fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StatsPage;