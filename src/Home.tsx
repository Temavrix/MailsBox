import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseClient";
import { connectGmail, getEmails } from "./gmailService";
import "./Home.css";

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
      setError("Unable to connect Gmail.");
      setConnecting(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="home">

      {/* Header */}
      <header className="home-header">
        <div className="brand">
          <div className="brand-icon">✉</div>
          <h1>MailBox</h1>
        </div>
        <button className="signout-button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </header>

      {/* Welcome */}
      <section className="welcome-section">
        <h2>Welcome back, {user.displayName?.split(" ")[0] || "there"}!</h2>
        <p>Here's what's happening with your inbox today.</p>
      </section>

      {/* User Profile */}
      <div className="profile-card">
        <div className="profile-avatar">
          {user.photoURL && ( <img src={user.photoURL}
              alt="Profile" width="80" height="80" style={{width: "80px",height: "80px",borderRadius: "50%",objectFit: "cover"}}
            />
          )}
        </div>

        <div className="profile-details">
          <p className="profile-name">{user.displayName}</p>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Gmail Section*/}
      <section className="gmail-section">
        <div className="gmail-header">
          <div className="gmail-title">
            <h2>Your Gmail Inbox</h2>
            <p>Manage and keep track of your emails.</p>
          </div>

          {gmailConnected && (
            <div className="connection-status">
              <span className="status-dot"></span>
              Connected
            </div>
          )}
        </div>

        {gmailConnected ? (
          <>
            <button className="primary-button" onClick={fetchEmails} disabled={loading}>
              {loading ? "Refreshing..." : "↻ Refresh Emails"}
            </button>

            <div className="email-list-heading">
              <h3>Recent Emails</h3>
              <span className="email-count">
                {emails.length} emails
              </span>
            </div>

            {loading ? (
              <div className="loading-message">
                Loading your emails hang on tight...
              </div>
            ) : emails.length > 0 ? (
              <div className="email-list">
                {emails.map((email) => (
                  <div className="email-card" key={email.id}>
                    <h3>{email.subject || "(No subject)"}</h3>
                    <p>{email.from}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                Your inbox is empty.
              </div>
            )}
          </>
        ) : (
          <div className="connect-state">
            <div className="connect-icon">✉</div>

            <h3>Connect your Gmail account</h3>

            <p>
              Link your Gmail account to access your emails
              and view important emails in your inbox from MailBox.
            </p>

            <button className="primary-button" onClick={handleConnectGmail} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect Gmail"}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </section>
    </div>
  );
}

export default Home;
