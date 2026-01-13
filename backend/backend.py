from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    supports_credentials=True,
    resources={
        r"/scan": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    }
)

REFERENCE_DNA = "ATGCTAGGCTA"
THRESHOLD = 2


def levenshtein(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            )
    return dp[n][m]


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json()
    dna = data["dna"].upper()
    organ = data["organ"]

    distance = levenshtein(dna, REFERENCE_DNA)
    status = "foreign" if distance > THRESHOLD else "normal"

    return jsonify({
        "organ": organ,
        "distance": distance,
        "status": status
    })


@app.route("/")
def health():
    return jsonify({"status": "Backend running"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
