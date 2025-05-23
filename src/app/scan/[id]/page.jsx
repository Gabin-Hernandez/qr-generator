'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import { collectionGroup, getDocs, increment, updateDoc } from 'firebase/firestore'

export default function ScanPage({ params }) {
  const router = useRouter()
  const codeId = params.id

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // Buscar en todas las subcolecciones "qrcodes"
        const snapshot = await getDocs(collectionGroup(db, 'qrcodes'))
        let foundDoc = null

        snapshot.forEach((doc) => {
          if (doc.id === codeId) {
            foundDoc = doc
          }
        })

        if (foundDoc) {
          const docRef = foundDoc.ref
          const { url } = foundDoc.data()

          // Aumentar el contador
          await updateDoc(docRef, {
            scans: increment(1),
          })

          // Redirigir
          window.location.href = url
        } else {
          alert('Código no encontrado')
        }
      } catch (err) {
        console.error('Error al redirigir:', err)
      }
    }

    fetchAndRedirect()
  }, [])

  return <p className="text-center mt-10 text-xl">Redirigiendo al enlace...</p>
}
