import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, signInAnonymouslyIfNeeded } from "../lib/firebase";
import type { UserData } from "../interfaces/user.interface";



export const useUser = (uid: string | undefined) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) {
        setError("UID no proporcionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Autenticar anónimamente si es necesario
        await signInAnonymouslyIfNeeded();
        
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setError(null);
        } else {
          setError("Usuario no encontrado");
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error al cargar usuario");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  return { userData, loading, error };
};
