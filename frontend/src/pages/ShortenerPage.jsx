import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Paper, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { logEvent } from '../logger/logger';

const ShortenerPage = ({ token }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const handleShorten = async () => {
    const payloads = urls.map((url) => ({
      longUrl: url.longUrl,
      validity: parseInt(url.validity) || 30,
      shortcode: url.shortcode || undefined,
    }));
    try {
      const response = await axios.post('http://localhost:5000/api/shorten', { urls: payloads });
      setResults(response.data);
      setSnackbar({ open: true, message: 'URLs shortened successfully!', severity: 'success' });
      logEvent('frontend', 'info', 'component', 'URLs shortened successfully', token);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to shorten URLs', severity: 'error' });
      logEvent('frontend', 'error', 'component', 'Failed to shorten URLs', token);
    }
  };

  const handleAddUrl = () => {
    setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mt: 2, mb: 3, textAlign: 'center' }}>
        URL Shortener
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 900, boxSizing: 'border-box' }}>
        <Grid container spacing={3} justifyContent="center">
          {urls.map((url, i) => (
            <Grid item xs={12} key={i}>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Long URL"
                      value={url.longUrl}
                      onChange={(e) => handleChange(i, 'longUrl', e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      helperText="Paste the URL to be shortened."
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Validity (min)"
                      value={url.validity}
                      onChange={(e) => handleChange(i, 'validity', e.target.value)}
                      fullWidth
                      type="number"
                      variant="outlined"
                      helperText="Defaults to 30 min"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Custom Shortcode"
                      value={url.shortcode}
                      onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
                      fullWidth
                      variant="outlined"
                      helperText="Optional"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            {urls.length < 5 && (
              <IconButton color="secondary" onClick={handleAddUrl} sx={{ mr: 2 }}>
                <AddIcon />
              </IconButton>
            )}
            <Button variant="contained" color="primary" size="large" onClick={handleShorten} sx={{ minWidth: 180, fontWeight: 700 }}>
              Shorten URLs
            </Button>
          </Grid>
          {results.length > 0 && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 4, overflowX: 'auto', width: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Short URL</strong></TableCell>
                      <TableCell><strong>Original URL</strong></TableCell>
                      <TableCell><strong>Expires At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((res, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">{res.shortUrl}</a>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.originalUrl}</TableCell>
                        <TableCell>{new Date(res.expiresAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShortenerPage;