'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '../../../lib/firebaseConfig'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'

export default function ScanPage({ params }) {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      console.log('Intentando redirigir con params:', params)

      if (!params?.id) {
        console.error('No se recibió el ID en los parámetros')
        return
      }

      try {
        const docRef = doc(db, 'qrcodes', params.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const qrData = docSnap.data()
          console.log('QR encontrado:', qrData)

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
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold">Redirigiendo...</h1>
    </div>
  )
}
