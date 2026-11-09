import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import Mailbox from "./assets/MailBox.png";
import { auth, googleProvider } from "./firebaseClient";
import { saveUserData } from "./userService";
import Home from "./Home";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          await saveUserData(currentUser);
        } catch (err) {
          console.error("Failed to save user data:", err);
          setError("Could not save your account information.");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (user) {
    return (
      <>
        <Home user={user} />
        {error && <p>{error}</p>}
      </>
    );
  }

  return (
    <>
      <section>
        <div className="card linear-direction">
          <img src={Mailbox} alt="PatchFlow" width="40" height="40" />
          <h1>Log in to MailBox</h1><br/>
          <button className="button" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
          {error && <p>{error}</p>}<br/>
          Don't have an account? <a onClick={handleGoogleLogin}>Sign up</a>
        </div>
      </section>
    </>
  );
}

export default App;