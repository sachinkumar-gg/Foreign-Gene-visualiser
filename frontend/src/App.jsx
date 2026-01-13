import { useState } from "react";

function App() {
  const [organ, setOrgan] = useState("liver");
  const [dna, setDna] = useState("ATGTTAGACTA");
  const [result, setResult] = useState(null);

  async function scanDNA() {
  console.log("Scan button clicked");

  const response = await fetch("http://127.0.0.1:5000/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ organ, dna }),
  });

  const data = await response.json();
  console.log("Response from backend:", data);
  setResult(data);
}

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>DNA Scan Simulator</h1>

      <label>Organ:</label>
      <br />
      <select value={organ} onChange={(e) => setOrgan(e.target.value)}>
        <option value="brain">Brain</option>
        <option value="lungs">Lungs</option>
        <option value="liver">Liver</option>
      </select>

      <br /><br />

      <label>DNA Sequence:</label>
      <br />
      <input
        value={dna}
        onChange={(e) => setDna(e.target.value)}
        style={{ width: "300px" }}
      />

      <br /><br />

      <button onClick={scanDNA}>Scan</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Scan Result</h3>
          <p><b>Organ:</b> {result.organ}</p>
          <p><b>Edit Distance:</b> {result.distance}</p>
          <p
            style={{
              color: result.status === "foreign" ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            Status: {result.status.toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
