import React, { useState, useEffect } from 'react';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We are now using the real chrome.storage call again.
    chrome.storage.local.get("scanResults", (data) => {
      if (data.scanResults) {
        setResults(data.scanResults);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="loading">Scanning...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Link Scan Results</h1>
      </header>
      <main className="results-container">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div
              key={index}
              className={`result-item ${result.isDangerous ? 'dangerous' : 'safe'}`}
            >
              <p className="link-url">{result.domain}</p>
              <p className="details">Netcraft: {result.netcraft.status}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </main>
    </div>
  );
}

export default App;