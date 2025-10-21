import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚛️ React Counter App</h1>
      <p style={styles.number}>{count}</p>
      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => setCount(count + 1)}>
          ➕ Increase
        </button>
        <button style={styles.btn} onClick={() => setCount(count - 1)}>
          ➖ Decrease
        </button>
        <button style={styles.resetBtn} onClick={() => setCount(0)}>
          🔁 Reset
        </button>
      </div>
      <p style={{ marginTop: 40, color: "#777" }}>
        Edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "100px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#61dafb",
  },
  number: {
    fontSize: "4rem",
    margin: "20px 0",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  btn: {
    backgroundColor: "#61dafb",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
  resetBtn: {
    backgroundColor: "#ff6b6b",
    border: "none",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
  },
};

export default App;