import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";

import { auth } from "./firebaseClient";
import { connectGmail, getEmails } from "./gmailService";

interface HomeProps {
  user: User;
}

interface Email {
  id: string;
  from: string;
  subject: string;
}

function Home({ user }: HomeProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [gmailConnected, setGmailConnected] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError("");

      const data: Email[] = await getEmails();

      setEmails(data);
      setGmailConnected(true);
    } catch (err) {
      console.error(err);

      setGmailConnected(false);
      setError("Gmail is not connected. Please connect your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setConnecting(true);
      setError("");

      await connectGmail();
    } catch (err) {
      console.error(err);
      setError("Unable to connect Gmail.");
      setConnecting(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="home">
      <h1>Welcome to Nuvin</h1>

      <p>{user.displayName}</p>
      <p>{user.email}</p>
      <p>UID: {user.uid}</p>

      <hr />

      <h2>Gmail</h2>

      {gmailConnected ? (
        <>
          <p>Gmail connected</p>

          <button onClick={fetchEmails} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Emails"}
          </button>

          {emails.map((email) => (
            <div className="email-card" key={email.id}>
              <h3>{email.subject || "(No subject)"}</h3>
              <p>{email.from}</p>
            </div>
          ))}
        </>
      ) : (
        <button onClick={handleConnectGmail} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect Gmail"}
        </button>
      )}

      {error && <p>{error}</p>}

      <hr />

      <button onClick={() => signOut(auth)}>
        Sign out
      </button>
    </div>
  );
}

export default Home;