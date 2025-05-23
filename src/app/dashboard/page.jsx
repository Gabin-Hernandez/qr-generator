"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import CreateQRForm from "./CreateQRForm";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [qrs, setQrs] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchQRCodes = async () => {
      if (!user) return;
      const q = query(
        collection(db, "qrcodes"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQrs(results);
    };

    fetchQRCodes();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="text-red-600 underline">
          Cerrar sesión
        </button>
      </div>

      <CreateQRForm onCreated={() => window.location.reload()} />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Mis códigos QR:</h2>
        <ul className="space-y-4">
          {qrs.map((qr) => (
            <li key={qr.id} className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-bold">{qr.title}</h3>
              <p>{qr.content}</p>
              <div className="my-2">
                <QRCodeSVG
                  value={`https://qr-generator-oxd4.vercel.app/scan/${qr.id}`}
                  size={128}
                />
              </div>
              <p className="text-sm text-gray-500">
                Escaneado {qr.scanCount} veces
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
