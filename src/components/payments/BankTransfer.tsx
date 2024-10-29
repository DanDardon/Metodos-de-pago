import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface BankTransferProps {
  onBack: () => void;
}

const bankDetails = {
  bank: 'Banco Nacional',
  accountNumber: '1234-5678-9012-3456',
  accountHolder: 'Empresa S.A.',
  accountType: 'Corriente',
  rut: '12.345.678-9',
  email: 'pagos@empresa.com',
};

export default function BankTransfer({ onBack }: BankTransferProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmationFile, setConfirmationFile] = useState<File | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setConfirmationFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationFile) {
      alert('Por favor adjunta el comprobante de transferencia');
      return;
    }

    // Here you would typically:
    // 1. Upload the confirmation file to your server
    // 2. Create the order with pending status
    // 3. Send confirmation email
    alert('Comprobante recibido. Procesaremos tu pago y confirmaremos por email.');
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transferencia Bancaria</h2>

      <div className="space-y-4 mb-6">
        {Object.entries(bankDetails).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="font-medium">{value}</p>
            </div>
            <button
              onClick={() => copyToClipboard(value, key)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {copied === key ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjuntar comprobante de transferencia
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Enviar comprobante
        </button>
      </form>
    </div>
  );
}