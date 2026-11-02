import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebaseClient";

export async function saveUserData(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  const userData = {
    email: user.email,
    displayName: user.displayName,
  };

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      ...userData,
      gmailConnected: false,
    });
  } else {
    await setDoc(userRef, userData, { merge: true });
  }
}