"use client";
import { useState } from 'react';
import { useAuth } from '../../providers';

export default function SecurityClient() {
  const { user, tfaSetup, tfaVerify, tfaDisable, tfaRecoveryCodes } = useAuth();
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [codes, setCodes] = useState([]);

  async function handleSetup() {
    setMsg('');
    const s = await tfaSetup();
    setSetup(s);
  }
  async function handleVerify(e) {
    e.preventDefault(); setMsg('');
    try {
      await tfaVerify(code.trim());
      setMsg('2FA enabled.');
      setSetup(null);
    } catch (e) { setMsg(e.message || 'Failed to verify'); }
  }
  async function handleDisable() {
    await tfaDisable(); setMsg('2FA disabled.');
  }
  async function handleRecovery() {
    const r = await tfaRecoveryCodes(); setCodes(r.codes || []);
  }

  if (!user) return <section className="section"><p className="muted">Please <a href="/login">login</a>.</p></section>;

  return (
    <section className="section">
      <h1>Security</h1>
      <div className="card" style={{marginBottom:'.75rem'}}>
        <p><strong>Two-Factor Authentication:</strong> {user.tfa ? 'Enabled' : 'Disabled'}</p>
        {!user.tfa ? (
          <div>
            {setup ? (
              <div>
                <p className="muted">Scan this QR in your authenticator app or enter the secret:</p>
                {setup.otpauthUrl && (
                  <img alt="QR" width={180} height={180} src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(setup.otpauthUrl)}&size=180x180`} />
                )}
                <p className="muted"><code>{setup.base32}</code></p>
                <form onSubmit={handleVerify}>
                  <div className="field">
                    <label htmlFor="code">Enter 6‑digit code</label>
                    <input id="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="123456" />
                  </div>
                  <button type="submit">Verify</button>
                </form>
              </div>
            ) : (
              <button onClick={handleSetup}>Enable 2FA</button>
            )}
          </div>
        ) : (
          <div>
            <button onClick={handleDisable}>Disable 2FA</button>
            <button onClick={handleRecovery} style={{marginLeft:'.5rem'}}>Get Recovery Codes</button>
            {codes.length > 0 && (
              <ul className="muted" style={{marginTop:'.5rem'}}>
                {codes.map((c,i)=>(<li key={i}><code>{c}</code></li>))}
              </ul>
            )}
          </div>
        )}
        {msg && <p className="muted" style={{marginTop:'.5rem'}}>{msg}</p>}
      </div>
    </section>
  );
}

