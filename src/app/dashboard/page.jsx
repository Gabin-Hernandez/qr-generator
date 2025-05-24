'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../lib/firebaseConfig'
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../../hooks/useAuth'
import { QRCodeSVG } from 'qrcode.react'
import CreateQRForm from './CreateQRForm'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [qrs, setQrs] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading])

  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user) return
      const q = query(collection(db, 'qrcodes'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setQrs(results)
    }

    fetchQRCodes()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este código QR?')
    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'qrcodes', id))
      setQrs(qrs.filter(qr => qr.id !== id))
    } catch (error) {
      console.error('Error al eliminar QR:', error)
    }
  }

  const handleEdit = async (qr) => {
    const newContent = prompt('Nuevo enlace para el QR:', qr.content)
    if (!newContent || newContent === qr.content) return

    try {
      await updateDoc(doc(db, 'qrcodes', qr.id), { content: newContent })
      setQrs(qrs.map(q => q.id === qr.id ? { ...q, content: newContent } : q))
    } catch (error) {
      console.error('Error al editar QR:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="text-red-600 underline">Cerrar sesión</button>
      </div>

      <CreateQRForm onCreated={() => window.location.reload()} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Mis códigos QR:</h2>
        <ul className="space-y-4">
          {qrs.map(qr => (
            <li key={qr.id} className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-bold">{qr.title}</h3>
              <p className="text-sm break-all">{qr.content}</p>
              <p className="text-xs text-gray-500 mb-2">Escaneado {qr.scanCount} veces</p>

              <QRCodeSVG
                value={`https://qr-generator-oxd4.vercel.app/scan/${qr.id}`}
                size={128}
              />

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(qr)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(qr.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
