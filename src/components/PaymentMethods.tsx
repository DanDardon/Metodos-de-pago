import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Banknote, Truck, ArrowRight, Check } from 'lucide-react';
import StripePayment from './payments/StripePayment';
import BankTransfer from './payments/BankTransfer';
import CashOnDelivery from './payments/CashOnDelivery';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    title: 'Tarjeta de Crédito/Débito',
    description: 'Pago seguro con tarjeta a través de Stripe',
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: 'transfer',
    title: 'Transferencia Bancaria',
    description: 'Transferencia directa a nuestra cuenta',
    icon: <Banknote className="w-6 h-6" />,
  },
  {
    id: 'cod',
    title: 'Pago Contra Entrega',
    description: 'Paga cuando recibas tu pedido',
    icon: <Truck className="w-6 h-6" />,
  },
];

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedMethod('');
  };

  const renderPaymentDetails = () => {
    switch (selectedMethod) {
      case 'card':
        return <StripePayment onBack={handleBack} />;
      case 'transfer':
        return <BankTransfer onBack={handleBack} />;
      case 'cod':
        return <CashOnDelivery onBack={handleBack} />;
      default:
        return null;
    }
  };

  if (showDetails) {
    return renderPaymentDetails();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Método de Pago</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className={`p-3 rounded-lg ${
              selectedMethod === method.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {method.icon}
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-800">{method.title}</h3>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            
            <div className={`w-4 h-4 rounded-full border-2 ml-4 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-2 h-2 mx-auto mt-0.5 bg-white rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => selectedMethod && handleMethodSelect(selectedMethod)}
        disabled={!selectedMethod || loading}
        className={`mt-6 w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition-all duration-200 ${
          selectedMethod && !loading
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Continuar con el pago
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}