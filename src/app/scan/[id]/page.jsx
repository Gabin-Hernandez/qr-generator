'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../../../lib/firebaseConfig'
import { doc, getDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore'

export default function ScanPage({ params }) {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      if (!params?.id) return

      try {
        const docRef = doc(db, 'qrcodes', params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const qrData = docSnap.data()

          await updateDoc(docRef, {
            scanCount: increment(1),
          })

          location.replace(qrData.content)
        } else {
          console.error('QR no encontrado')
        }
      } catch (error) {
        console.error('Error al redirigir:', error)
      }
    }

    handleRedirect()
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <h1 className="mt-6 text-2xl font-semibold drop-shadow-lg animate-pulse">Cargando...</h1>
      <p className="mt-2 text-sm opacity-80">Por favor espera unos segundos</p>
    </div>
  )
}
