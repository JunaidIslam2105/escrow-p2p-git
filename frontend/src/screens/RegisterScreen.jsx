import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Paper, Alert } from '@mui/material';
import axios from 'axios';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get role from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location]);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        setError('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      setError('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    console.log('Form submitted'); // Add this line for debugging
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!role) {
      setError('Please select a role');
      return;
    }

    if (role === 'buyer' && !walletAddress) {
      setError('Please connect your wallet for buyer registration');
      return;
    }

    if (role === 'seller' && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName)) {
      setError('Please fill in all bank details');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`,
        { 
          name, 
          email, 
          password, 
          role,
          walletAddress,
          bankDetails
        },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setSuccess(true);
      
      // Redirect after successful registration
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Registration error response:', error.response);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          :'Registration failed. Please try again.'
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful! Redirecting...</Alert>}
        
        <Box component="form" onSubmit={submitHandler} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={connectWallet}
              fullWidth
              sx={{ mb: 1 }}
            >
              {walletAddress ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
            {walletAddress && (
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                Connected: {walletAddress}
              </Typography>
            )}
          </Box>
          
          {role === 'seller' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Bank Details
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="accountNumber"
                label="Account Number"
                value={bankDetails.accountNumber}
                onChange={handleBankDetailsChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="ifscCode"
                label="IFSC Code"
                value={bankDetails.ifscCode}
                onChange={handleBankDetailsChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="bankName"
                label="Bank Name"
                value={bankDetails.bankName}
                onChange={handleBankDetailsChange}
              />
            </Box>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}
              >
                Login
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterScreen;