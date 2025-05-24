import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../../lib/firebaseConfig'

export const dynamic = 'force-dynamic'

export default async function ScanPage({ params }) {
  const ref = doc(db, 'qrcodes', params.id)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    return (
      <html>
        <body>
          <h1>Error: Código QR no encontrado</h1>
        </body>
      </html>
    )
  }

  const data = snap.data()

  // Actualiza contador
  await updateDoc(ref, {
    scanCount: increment(1),
  })

  // Devuelve una página HTML con redirección automática vía meta tag
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${data.content}`} />
        <title>Redirigiendo...</title>
      </head>
      <body>
        <p>Redirigiendo a <a href={data.content}>{data.content}</a></p>
      </body>
    </html>
  )
}
