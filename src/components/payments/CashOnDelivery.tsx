import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

interface CashOnDeliveryProps {
  onBack: () => void;
}

export default function CashOnDelivery({ onBack }: CashOnDeliveryProps) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // Here you would:
      // 1. Validate the address
      // 2. Create the order with COD payment method
      // 3. Send confirmation email
      alert('Pedido confirmado. Recibirás un email con los detalles de la entrega.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido. Por favor intenta nuevamente.');
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pago Contra Entrega</h2>

      <div className="mb-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            <strong>Importante:</strong> El pago se realizará en efectivo al momento de la entrega.
            Asegúrate de tener el monto exacto disponible.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección de entrega
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ingresa la dirección completa"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono de contacto
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+56 9 1234 5678"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
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
            'Confirmar pedido'
          )}
        </button>
      </form>
    </div>
  );
}