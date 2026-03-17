import { useMemo, useState } from "react";
import mriImage from "./mri.jpg";

function App() {
  const [organ, setOrgan] = useState("brain");
  const [dna, setDna] = useState("ATGTTAGACTA");
  const [result, setResult] = useState(null);
  const [heatspots, setHeatspots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const referenceDna = useMemo(() => "ATGCTAGTACGTACGCT", []);

  function generateHeatmap(isAbnormal) {
    if (!isAbnormal) {
      setHeatspots([]);
      return;
    }

    const spots = Array.from({ length: 7 }, () => ({
      top: `${Math.random() * 72 + 12}%`,
      left: `${Math.random() * 72 + 12}%`,
      intensity: Math.random() * 0.55 + 0.35,
      size: Math.random() * 90 + 110,
    }));

    setHeatspots(spots);
  }

  async function scanDNA() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organ, dna }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      setResult(data);
      generateHeatmap(data.status === "foreign");
    } catch (e) {
      setResult(null);
      setHeatspots([]);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="controls">
        <h1>Abnormality Check</h1>

        <div className="box">
          <h3>Reference DNA</h3>
          <code>{referenceDna}</code>
        </div>

        <div className="box">
          <label>Target Organ</label>
          <select value={organ} onChange={(e) => setOrgan(e.target.value)}>
            <option value="brain">Brain</option>
            <option value="lungs">Lungs</option>
            <option value="liver">Liver</option>
          </select>
        </div>

        <div className="box">
          <label>Sample DNA</label>
          <input
            value={dna}
            onChange={(e) => setDna(e.target.value.toUpperCase())}
            placeholder="Enter DNA (A, T, G, C)"
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <button className="scan-btn" onClick={scanDNA} disabled={isLoading}>
          {isLoading ? "SCANNING..." : "RUN SCAN"}
        </button>

        {error && <p className="status foreign">Error: {error}</p>}

        {result && !error && (
          <p className={`status ${result.status}`}>
            Status: {String(result.status).toUpperCase()}
            <br />
            Organ: {result.organ}
            <br />
            Edit Distance: {result.distance}
          </p>
        )}
      </div>

      <div className="scan-area">
        <div className="mri-wrapper">
          <img src={mriImage} className="mri" alt="MRI" />

          {heatspots.map((spot, i) => (
            <div
              key={i}
              className="heat"
              style={{
                top: spot.top,
                left: spot.left,
                opacity: spot.intensity,
                width: `${spot.size}px`,
                height: `${spot.size}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
