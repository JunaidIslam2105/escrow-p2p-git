import React from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <>
      <Grid container spacing={3} sx={{ py: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom>
            P2P Escrow Management System
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            A secure escrow system for agricultural bulk orders between buyers and farmers,
            utilizing blockchain technology for transparency and security.
          </Typography>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ py: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                For Buyers
              </Typography>
              <Typography variant="body1" paragraph>
                Place bulk orders to farmers securely. Your funds are held in escrow until the order is fulfilled.
              </Typography>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Register as Buyer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                For Sellers
              </Typography>
              <Typography variant="body1" paragraph>
                Receive secure payments for your agricultural products. Funds are guaranteed through blockchain escrow.
              </Typography>
              <Link to="/register?role=seller" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="success">
                  Register as Seller
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Already a Member?
              </Typography>
              <Typography variant="body1" paragraph>
                Login to your account to manage your orders, track payments, and more.
              </Typography>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="info">
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ py: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h2" gutterBottom>
            How It Works
          </Typography>
          <Typography component="ol" variant="body1" sx={{ pl: 2 }}>
            <li>Buyers place bulk orders to farmers through the platform</li>
            <li>Buyers transfer INR funds to the escrow account</li>
            <li>The system converts INR to USDT and places it on the blockchain</li>
            <li>Farmers fulfill the order as per contract terms</li>
            <li>System verifies the contract fulfillment</li>
            <li>Upon verification, USDT is converted back to INR</li>
            <li>INR is transferred to farmers' accounts</li>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeScreen;