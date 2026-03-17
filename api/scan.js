const REFERENCE_DNA = "ATGCTAGTACGTACGCT";
const THRESHOLD = 2;

function levenshtein(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[n][m];
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { dna, organ } = req.body ?? {};
    if (typeof dna !== "string" || typeof organ !== "string") {
      return res.status(400).json({ error: "Expected JSON body with { organ: string, dna: string }" });
    }

    const distance = levenshtein(dna.toUpperCase(), REFERENCE_DNA);
    const status = distance > THRESHOLD ? "foreign" : "normal";

    return res.status(200).json({ organ, distance, status });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
