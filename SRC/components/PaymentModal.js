import React, { useState } from 'react';
import { FiBitcoin, FiSmartphone, FiCheck, FiClock, FiCopy } from 'react-icons/fi';
import Modal from './Modal';
import { generateBitcoinPayment, createOpayPayment, uploadOpayProof } from '../services/payments';

function PaymentModal({ isOpen, onClose, plan, paymentMethods, onPaymentSuccess, addNotification }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentStep, setPaymentStep] = useState('select'); // select, details, processing, success
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const planPrices = {
    pro: 7.99,
    business: 29.99
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setPaymentStep('details');
  };

  const handleBitcoinPayment = async () => {
    try {
      const result = await generateBitcoinPayment(plan);
      if (result.success) {
        setPaymentDetails(result);
        setPaymentStep('processing');
        startPaymentPolling(result.payment_id);
        addNotification('Bitcoin address generated', 'success');
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to generate payment', 'error');
    }
  };

  const handleOpayPayment = async () => {
    try {
      const result = await createOpayPayment(plan);
      if (result.success) {
        setPaymentDetails(result);
        setPaymentStep('processing');
        addNotification('OPay payment created', 'success');
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to create payment', 'error');
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification('File size should be less than 5MB', 'error');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadProof = async () => {
    if (!file) {
      addNotification('Please select a file', 'error');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadOpayProof(paymentDetails.payment_id, file);
      if (result.success) {
        addNotification('Proof uploaded successfully', 'success');
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess();
          resetModal();
        }, 3000);
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to upload proof', 'error');
    } finally {
      setUploading(false);
    }
  };

  const startPaymentPolling = (paymentId) => {
    // In real app, poll API for payment status
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onPaymentSuccess();
        resetModal();
      }, 3000);
    }, 10000); // Simulate 10 second payment
  };

  const resetModal = () => {
    setSelectedMethod(null);
    setPaymentStep('select');
    setPaymentDetails(null);
    setFile(null);
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied to clipboard', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title={`Upgrade to ${plan}`} size="lg">
      {paymentStep === 'select' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-premium-gold mb-2">
              ${planPrices[plan]}
            </div>
            <p className="text-gray-400">One-time payment • 30-day subscription</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                className="p-6 rounded-xl border-2 border-crystal hover:border-electric-blue transition-all text-left group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${method.bgColor} mr-4`}>
                    <div className={`text-2xl ${method.color}`}>{method.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  {method.id === 'bitcoin' ? 'Instant activation • Secure' : 'Manual verification • 24h processing'}
                </div>
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            All payments are secure and encrypted
          </div>
        </div>
      )}

      {paymentStep === 'details' && selectedMethod === 'bitcoin' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-4">
              <FiBitcoin className="text-3xl text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bitcoin Payment</h3>
            <p className="text-gray-400">Send exact amount to the generated address</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-crystal">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-premium-gold mb-2">
                ${planPrices[plan]} BTC
              </div>
              <div className="text-gray-400">≈ {planPrices[plan] / 50000} BTC</div>
            </div>

            <button
              onClick={handleBitcoinPayment}
              className="w-full luxury-btn primary py-4"
            >
              Generate Bitcoin Address
            </button>
          </div>

          <div className="text-sm text-gray-500">
            <div className="flex items-center mb-2">
              <FiCheck className="text-success mr-2" />
              <span>Unique address for each payment</span>
            </div>
            <div className="flex items-center">
              <FiClock className="text-warning mr-2" />
              <span>Activation within 10 minutes of confirmation</span>
            </div>
          </div>
        </div>
      )}

      {paymentStep === 'details' && selectedMethod === 'opay' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
              <FiSmartphone className="text-3xl text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">OPay Payment</h3>
            <p className="text-gray-400">Send payment and upload proof for verification</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-crystal">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-premium-gold mb-2">
                ${planPrices[plan]}
              </div>
              <div className="text-gray-400">Send exact amount</div>
            </div>

            <button
              onClick={handleOpayPayment}
              className="w-full luxury-btn primary py-4 mb-4"
            >
              Generate OPay Reference
            </button>

            <div className="text-sm text-gray-500 text-center">
              After payment, you'll need to upload a screenshot as proof
            </div>
          </div>
        </div>
      )}

      {paymentStep === 'processing' && paymentDetails && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold mb-2">
              {selectedMethod === 'bitcoin' ? 'Waiting for Bitcoin Payment' : 'OPay Payment Created'}
            </h3>
            <p className="text-gray-400">
              {selectedMethod === 'bitcoin' 
                ? 'Send the Bitcoin to complete your payment' 
                : 'Send payment and upload proof below'}
            </p>
          </div>

          {selectedMethod === 'bitcoin' && paymentDetails.crypto_address && (
            <div className="bg-gray-900/30 rounded-xl p-6 border border-crystal">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bitcoin Address
                </label>
                <div className="flex items-center">
                  <code className="flex-1 bg-gray-900 p-3 rounded-lg font-mono text-sm break-all">
                    {paymentDetails.crypto_address}
                  </code>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.crypto_address)}
                    className="ml-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <div className="bg-gray-900 p-3 rounded-lg font-mono text-center text-xl font-bold text-premium-gold">
                  {paymentDetails.amount} BTC
                </div>
              </div>

              <div className="text-center text-sm text-warning">
                <FiClock className="inline mr-2" />
                Expires in 30 minutes
              </div>
            </div>
          )}

          {selectedMethod === 'opay' && paymentDetails.opay_details && (
            <div className="space-y-6">
              <div className="bg-gray-900/30 rounded-xl p-6 border border-crystal">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      OPay Number
                    </label>
                    <div className="bg-gray-900 p-3 rounded-lg font-mono text-center">
                      {paymentDetails.opay_details.phone}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Reference Code
                    </label>
                    <div className="flex items-center">
                      <code className="flex-1 bg-gray-900 p-3 rounded-lg font-mono text-center">
                        {paymentDetails.opay_details.reference}
                      </code>
                      <button
                        onClick={() => copyToClipboard(paymentDetails.opay_details.reference)}
                        className="ml-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                      >
                        <FiCopy />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Amount
                    </label>
                    <div className="bg-gray-900 p-3 rounded-lg font-mono text-center text-xl font-bold text-premium-gold">
                      ${paymentDetails.opay_details.amount}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Upload Payment Proof (Screenshot)
                </label>
                <div className="border-2 border-dashed border-crystal rounded-xl p-8 text-center hover:border-electric-blue transition-colors">
                  <input
                    type="file"
                    id="proof-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    <FiSmartphone className="text-4xl text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                      Click to upload payment proof
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, or PDF (max 5MB)
                    </p>
                  </label>
                  {file && (
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-sm">Selected: {file.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUploadProof}
                disabled={!file || uploading}
                className="w-full luxury-btn primary py-4"
              >
                {uploading ? 'Uploading...' : 'Submit Proof for Verification'}
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            Do not close this window until payment is complete
          </div>
        </div>
      )}

      {paymentStep === 'success' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-success/20 to-emerald-500/20 mb-6">
            <FiCheck className="text-4xl text-success" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Payment Successful!</h3>
          <p className="text-gray-400 mb-6">
            Your {plan} plan has been activated. Redirecting...
          </p>
          <div className="text-sm text-gray-500">
            Thank you for upgrading to Smart AI Price Tracker Elite!
          </div>
        </div>
      )}
    </Modal>
  );
}

export default PaymentModal;
