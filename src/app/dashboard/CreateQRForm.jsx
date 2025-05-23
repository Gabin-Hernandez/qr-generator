'use client'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig'
import { useAuth } from '../../hooks/useAuth'

export default function CreateQRForm({ onCreated }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !content || !user) return

    await addDoc(collection(db, 'qrcodes'), {
      title,
      content,
      scanCount: 0,
      userId: user.uid,
      createdAt: serverTimestamp(),
    })

    setTitle('')
    setContent('')
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        type="text"
        placeholder="Título del QR"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Enlace o contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Crear QR
      </button>
    </form>
  )
}
