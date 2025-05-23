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
        // Incrementar contador
        await updateDoc(docRef, {
          scanCount: increment(1),
        })

        // Redirigir
        window.location.href = data.content
      } else {
        console.error('QR no encontrado')
        router.push('/')
      }
    }

    handleRedirect()
  }, [id])

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Redirigiendo...</p>
    </div>
  )
}
