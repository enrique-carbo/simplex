// components/dashboard/LogoutButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full text-destructive hover:bg-destructive/5 gap-2"
    >
      <LogOut className="h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
}