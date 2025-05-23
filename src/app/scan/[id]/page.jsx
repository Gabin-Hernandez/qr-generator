// src/app/scan/[id]/page.jsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../../lib/firebaseConfig'

export default function ScanPage({ params }) {
  const router = useRouter()

  useEffect(() => {
    const handleScan = async () => {
      const qrRef = doc(db, 'qrcodes', params.id)
      const qrSnap = await getDoc(qrRef)

      if (!qrSnap.exists()) {
        console.error('QR no encontrado')
        router.push('/') // redirige a home si no existe
        return
      }

      const qrData = qrSnap.data()

      // Actualiza contador
      await updateDoc(qrRef, {
        scanCount: increment(1),
      })

      // Redirige al link original
      window.location.href = qrData.content
    }

    handleScan()
  }, [params.id, router])

  return (
    <div className="p-6 text-center">
      <p>Redirigiendo...</p>
    </div>
  )
}
