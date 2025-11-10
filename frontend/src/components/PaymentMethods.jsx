import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Grid,
  InputAdornment,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  Phone,
  QrCode2,
  CreditCard,
  LocalShipping,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import paymentService, { PAYMENT_GATEWAYS } from '../services/paymentService';

const MotionCard = motion(Card);

const PaymentMethods = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showUPIDialog, setShowUPIDialog] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiLink, setUpiLink] = useState('');
  
  // Card details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const paymentMethods = [
    {
      id: PAYMENT_GATEWAYS.UPI,
      name: 'UPI',
      description: 'Pay using any UPI app',
      icon: <QrCode2 sx={{ fontSize: 32 }} />,
      color: '#00C853',
      disabled: false,
    },
    {
      id: PAYMENT_GATEWAYS.PHONEPE,
      name: 'PhonePe',
      description: 'Pay using PhonePe',
      icon: <Phone sx={{ fontSize: 32 }} />,
      color: '#5f259f',
      disabled: false,
    },
    {
      id: PAYMENT_GATEWAYS.GOOGLEPAY,
      name: 'Google Pay',
      description: 'Pay using Google Pay',
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
      color: '#4285F4',
      disabled: false,
    },
    {
      id: PAYMENT_GATEWAYS.CARD,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: <CreditCard sx={{ fontSize: 32 }} />,
      color: '#FF6B00',
      disabled: false,
    },
    {
      id: PAYMENT_GATEWAYS.COD,
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: <LocalShipping sx={{ fontSize: 32 }} />,
      color: '#FFA000',
      disabled: false,
    },
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }
    
    // Limit CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }
    
    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleUPIPayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentService.initiateUPIPayment({
        amount: orderDetails.total,
        orderId: orderDetails.orderId,
        customerName: orderDetails.customerName,
        customerEmail: orderDetails.customerEmail,
      });

      if (response.success) {
        setUpiLink(response.upiLink);
        setShowUPIDialog(true);
      }
    } catch (error) {
      onPaymentError(error.message || 'UPI payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePhonePePayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentService.initiatePhonePePayment({
        amount: orderDetails.total,
        orderId: orderDetails.orderId,
        customerName: orderDetails.customerName,
        customerEmail: orderDetails.customerEmail,
        phone: orderDetails.phone,
      });

      if (response.success) {
        // In production, redirect to PhonePe payment page
        // window.location.href = response.redirectUrl;
        
        // For now, simulate success
        setTimeout(() => {
          onPaymentSuccess({
            method: 'PhonePe',
            transactionId: response.transactionId,
          });
          setProcessing(false);
        }, 2000);
      }
    } catch (error) {
      setProcessing(false);
      onPaymentError(error.message || 'PhonePe payment failed');
    }
  };

  const handleGooglePayPayment = async () => {
    setProcessing(true);
    try {
      const response = await paymentService.initiateGooglePayPayment({
        amount: orderDetails.total,
        orderId: orderDetails.orderId,
        customerName: orderDetails.customerName,
        customerEmail: orderDetails.customerEmail,
      });

      if (response.success) {
        // In production, use Google Pay API
        // https://developers.google.com/pay/api/web
        
        // For now, simulate success
        setTimeout(() => {
          onPaymentSuccess({
            method: 'Google Pay',
            transactionId: response.transactionId,
          });
          setProcessing(false);
        }, 2000);
      }
    } catch (error) {
      setProcessing(false);
      onPaymentError(error.message || 'Google Pay payment failed');
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
      onPaymentError('Please fill in all card details');
      return;
    }

    setProcessing(true);
    try {
      const response = await paymentService.processCardPayment({
        ...cardDetails,
        amount: orderDetails.total,
        orderId: orderDetails.orderId,
      });

      if (response.success) {
        onPaymentSuccess({
          method: 'Card',
          transactionId: response.transactionId,
          last4: response.last4,
        });
      }
    } catch (error) {
      onPaymentError(error.message || 'Card payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCODPayment = () => {
    onPaymentSuccess({
      method: 'Cash on Delivery',
      transactionId: `COD-${Date.now()}`,
    });
  };

  const handleProceedPayment = () => {
    switch (selectedMethod) {
      case PAYMENT_GATEWAYS.UPI:
        handleUPIPayment();
        break;
      case PAYMENT_GATEWAYS.PHONEPE:
        handlePhonePePayment();
        break;
      case PAYMENT_GATEWAYS.GOOGLEPAY:
        handleGooglePayPayment();
        break;
      case PAYMENT_GATEWAYS.CARD:
        handleCardPayment();
        break;
      case PAYMENT_GATEWAYS.COD:
        handleCODPayment();
        break;
      default:
        onPaymentError('Please select a payment method');
    }
  };

  const copyUPILink = () => {
    navigator.clipboard.writeText(upiLink);
  };

  const confirmUPIPayment = () => {
    setShowUPIDialog(false);
    // Simulate payment verification
    setTimeout(() => {
      onPaymentSuccess({
        method: 'UPI',
        transactionId: `UPI-${Date.now()}`,
      });
    }, 1000);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Select Payment Method
      </Typography>

      <RadioGroup value={selectedMethod} onChange={(e) => handleMethodSelect(e.target.value)}>
        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} key={method.id}>
              <MotionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  cursor: method.disabled ? 'not-allowed' : 'pointer',
                  border: '2px solid',
                  borderColor: selectedMethod === method.id ? method.color : 'divider',
                  bgcolor: selectedMethod === method.id ? `${method.color}10` : 'background.paper',
                  opacity: method.disabled ? 0.5 : 1,
                  boxShadow: 'none',
                }}
                onClick={() => !method.disabled && handleMethodSelect(method.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      value={method.id}
                      control={<Radio />}
                      label=""
                      disabled={method.disabled}
                      sx={{ m: 0 }}
                    />
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${method.color}20`,
                        color: method.color,
                      }}
                    >
                      {method.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {method.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      {/* Card Payment Form */}
      {selectedMethod === PAYMENT_GATEWAYS.CARD && (
        <Box sx={{ mt: 3 }}>
          <Card sx={{ bgcolor: 'action.hover', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Enter Card Details
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    placeholder="1234 5678 9012 3456"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    name="cardName"
                    value={cardDetails.cardName}
                    onChange={handleCardInputChange}
                    placeholder="JOHN DOE"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* UPI Payment Form */}
      {selectedMethod === PAYMENT_GATEWAYS.UPI && (
        <Box sx={{ mt: 3 }}>
          <Card sx={{ bgcolor: 'action.hover', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Enter UPI ID (Optional)
              </Typography>
              <TextField
                fullWidth
                label="UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                sx={{ mt: 1 }}
                helperText="Or use any UPI app to scan QR code"
              />
            </CardContent>
          </Card>
        </Box>
      )}

      {/* COD Notice */}
      {selectedMethod === PAYMENT_GATEWAYS.COD && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Cash on Delivery:</strong> Pay ₹{orderDetails.total} when the product is delivered to your doorstep.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Payment Button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleProceedPayment}
        disabled={!selectedMethod || processing}
        sx={{
          mt: 3,
          py: 1.5,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        }}
      >
        {processing ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          `Pay ₹${orderDetails.total}`
        )}
      </Button>

      {/* UPI Dialog */}
      <Dialog open={showUPIDialog} onClose={() => setShowUPIDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCode2 color="primary" />
            UPI Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Scan QR Code with any UPI app
            </Typography>
            
            {/* QR Code Placeholder */}
            <Box
              sx={{
                width: 250,
                height: 250,
                mx: 'auto',
                my: 3,
                border: '2px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
              }}
            >
              <QrCode2 sx={{ fontSize: 180, color: 'text.secondary' }} />
            </Box>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Copy UPI Link
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={upiLink}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={copyUPILink}
                sx={{ boxShadow: 'none' }}
              >
                Copy
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              After completing payment in your UPI app, click "I've Paid" below
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUPIDialog(false)} sx={{ boxShadow: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={confirmUPIPayment}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            I've Paid
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Security Notice */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          🔒 Your payment information is secure and encrypted
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentMethods;

