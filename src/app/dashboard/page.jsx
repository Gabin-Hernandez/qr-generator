'use client'
import { useEffect, useState } from 'react'
import { db, auth } from '@/lib/firebaseConfig'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import QRCode from 'react-qr-code'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [qrcodes, setQrcodes] = useState([])
  const router = useRouter()

  // Redirige si no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  // Obtener los QR del usuario
  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user) return

      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'qrcodes'))
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setQrcodes(docs)
    }

    fetchQRCodes()
  }, [user])

  // Eliminar QR
  const handleDelete = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'qrcodes', id))
    setQrcodes(qrcodes.filter((qr) => qr.id !== id))
  }

  // Cerrar sesión
  const logout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qrcodes.map((qr) => (
          <div key={qr.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">{qr.title}</h2>
            <QRCode value={`http://localhost:3000/scan/${qr.id}`} size={128} />
            <p className="text-sm text-gray-600 mt-2">Escaneos: {qr.scans}</p>
            <p className="text-sm text-gray-500 break-all">Destino: {qr.url}</p>
            <button onClick={() => handleDelete(qr.id)} className="mt-3 text-red-600 hover:underline">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
