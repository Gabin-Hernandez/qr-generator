'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../../lib/firebaseConfig'

export default function ScanPage({ params }) {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const handleRedirect = async () => {
      if (!id) return

      const docRef = doc(db, 'qrcodes', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        // Actualiza el contador
        await updateDoc(docRef, {
          scanCount: increment(1),
        })

        // Redirige al link original
        window.location.href = data.content
      } else {
        router.push('/') // Si el QR no existe
      }
    }

    handleRedirect()
  }, [id, router])

  return (
    <div className="p-6 text-center">
      <p className="text-lg font-semibold">Redirigiendo...</p>
    </div>
  )
}
