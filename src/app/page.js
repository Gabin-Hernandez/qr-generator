// src/app/page.js
'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a QR Generator</h1>
      <p className="mb-8 text-center max-w-md">
        Crea y administra tus códigos QR con seguimiento de escaneos.
      </p>
      <button
        onClick={() => router.push('/login')}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Iniciar sesión
      </button>
    </div>
  );
}
