import { db } from "@/lib/firebase";
import { doc, setDoc, collection, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";

export const addToHistory = async (userId: string, scheme: any) => {
  if (!userId || !scheme) return;
  try {
    const historyRef = doc(db, "users", userId, "recentSchemes", scheme.id);
    await setDoc(historyRef, { ...scheme, viewedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error adding history:", error);
  }
};

export const getRecentSchemes = async (userId: string) => {
  if (!userId) return [];
  try {
    const historyRef = collection(db, "users", userId, "recentSchemes");
    const q = query(historyRef, orderBy("viewedAt", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};