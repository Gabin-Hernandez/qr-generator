'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../../../lib/firebaseConfig'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 text-lg">Cargando...</p>
    </div>
  )
}
