import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Paper, Alert, Box } from '@mui/material';
import axios from 'axios';

const OrderCreationScreen = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    sellerId: '',
    terms: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/sellers`
        );
        setSellers(data);
      } catch (error) {
        setError('Failed to load seller list');
      }
    };
    fetchSellers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
        }
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders`,
        formData,
        config
      );

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to create order. Please try again.'
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Contract
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Contract created successfully!</Alert>}

        <Box component="form" onSubmit={submitHandler}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Product Description"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Price (ETH)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Seller</InputLabel>
            <Select
              value={formData.sellerId}
              name="sellerId"
              onChange={handleChange}
              required
            >
              {sellers.map(seller => (
                <MenuItem key={seller._id} value={seller._id}>
                  {seller.name} - {seller.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Contract Terms"
            name="terms"
            value={formData.terms}
            onChange={handleChange}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Contract
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderCreationScreen;