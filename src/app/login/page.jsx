'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard') // Redirige al dashboard
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
