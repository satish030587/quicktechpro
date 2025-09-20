"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main className="container section">
          <h1>Something went wrong</h1>
          <p className="muted">An unexpected error occurred. Please try again.</p>
          <div className="card">
            <pre style={{whiteSpace: 'pre-wrap'}}>{String(error?.message || '')}</pre>
          </div>
          <button onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  );
}

