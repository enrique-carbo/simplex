// components/dashboard/ResendVerification.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function ResendVerification() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">✓ Correo enviado con éxito</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <Mail className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800">Verifica tu correo</p>
          <p className="text-xs text-amber-700">Revisa tu bandeja de entrada</p>
        </div>
      </div>
      <Button
        onClick={handleResend}
        disabled={loading}
        variant="outline"
        size="sm"
        className="border-amber-300 hover:bg-amber-100 text-amber-800"
      >
        {loading ? 'Enviando...' : 'Reenviar email'}
      </Button>
    </div>
  );
}