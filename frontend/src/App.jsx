import { useState } from "react";
import "./App.css";

function App() {
  const [organ, setOrgan] = useState("brain");
  const [dna, setDna] = useState("");
  const [result, setResult] = useState(null);
  const [heatspots, setHeatspots] = useState([]);

  function generateHeatmap(isForeign) {
    if (!isForeign) {
      setHeatspots([]);
      return;
    }

    const spots = Array.from({ length: 6 }, () => ({
      top: Math.random() * 70 + "%",
      left: Math.random() * 60 + "%",
      intensity: Math.random() * 0.6 + 0.4,
    }));

    setHeatspots(spots);
  }

  async function scanDNA() {
    if (!dna) {
      alert("Enter a DNA sequence");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organ, dna }),
    });

    const data = await res.json();
    setResult(data);
    generateHeatmap(data.status === "foreign");
  }

  return (
    <div className="app">
      {/* LEFT PANEL */}
      <div className="controls">
        <h1>Genetic Scan Simulator</h1>

        <div className="box">
          <h3>Reference DNA</h3>
          <code>ATGCTAGGCTA</code>
        </div>

        <div className="box">
          <label>Target Organ</label>
          <select value={organ} onChange={e => setOrgan(e.target.value)}>
            <option value="brain">Brain</option>
            <option value="lungs">Lungs</option>
            <option value="liver">Liver</option>
          </select>
        </div>

        <div className="box">
          <label>Sample DNA</label>
          <input
            value={dna}
            onChange={e => setDna(e.target.value.toUpperCase())}
            placeholder="Enter DNA (A, T, G, C)"
          />
        </div>

        <button className="scan-btn" onClick={scanDNA}>
          RUN SCAN
        </button>

        {result && (
          <p className={`status ${result.status}`}>
            Status: {result.status.toUpperCase()} <br />
            Edit Distance: {result.distance}
          </p>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="scan-area">
        <div className="mri-wrapper">
          <img src="/mri.png" className="mri" />

          {heatspots.map((spot, i) => (
            <div
              key={i}
              className="heat"
              style={{
                top: spot.top,
                left: spot.left,
                opacity: spot.intensity,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
