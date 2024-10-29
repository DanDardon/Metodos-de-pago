import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, CreditCard } from 'lucide-react';

interface StripePaymentProps {
  onBack: () => void;
}

interface PaymentFormData {
  cardHolder: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  amount: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

const formatExpiry = (value: string): string => {
  return value
    .replace(/[^0-9]/g, '')
    .slice(0, 4)
    .replace(/^([2-9])/, '0$1')
    .replace(/^(1[3-9])/, '12')
    .replace(/^([0-1])([0-9])/, '$1/$2')
    .replace(/^([0-9]{2})([0-9]{1,2}).*/g, '$1/$2');
};

export default function StripePayment({ onBack }: StripePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardHolder: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    amount: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setFormData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === 'expiry') {
      const formatted = formatExpiry(value);
      const [month, year] = formatted.split('/');
      setFormData(prev => ({
        ...prev,
        expMonth: month || '',
        expYear: year || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await fetch('http://localhost:3000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      console.error('Error:', err);
      throw new Error('Could not create payment intent');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const clientSecret = await createPaymentIntent(formData.amount);

      const { error: paymentError } = await stripe.confirmPayment({
        elements: {
          payment_method: {
            card: {
              number: formData.cardNumber.replace(/\s/g, ''),
              exp_month: parseInt(formData.expMonth),
              exp_year: parseInt(formData.expYear),
              cvc: formData.cvc,
            },
            billing_details: {
              name: formData.cardHolder,
            },
          },
        },
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      alert('Payment successful!');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pago con Tarjeta</h2>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto a pagar (USD)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del titular
            </label>
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre como aparece en la tarjeta"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <input
                type="text"
                name="expiry"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                name="cvc"
                value={formData.cvc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">Tarjeta de prueba</h3>
          <p className="text-sm text-gray-600">
            Número: 4242 4242 4242 4242<br />
            Fecha: Cualquier fecha futura<br />
            CVC: Cualquier número de 3 dígitos
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition-all duration-200 ${
            loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            `Pagar $${formData.amount || '0.00'}`
          )}
        </button>
      </form>
    </div>
  );
}