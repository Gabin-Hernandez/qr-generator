'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../../../lib/firebaseConfig'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'

export default function ScanPage({ params }) {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const docRef = doc(db, 'qrcodes', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const qrData = docSnap.data()

          console.log('Documento encontrado:', qrData)

          await updateDoc(docRef, {
            scanCount: increment(1),
          })

          window.location.href = qrData.content
        } else {
          console.error('Documento no encontrado')
        }
      } catch (error) {
        console.error('Error en redirección:', error)
      }
    }

    handleRedirect()
  }, [id])

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold">Redirigiendo...</h1>
    </div>
  )
}
