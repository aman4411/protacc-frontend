import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://protacc-backend.onrender.com/ping")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("API call failed"));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Protacc Frontend</h1>
      <p>API says: {message}</p>
    </div>
  );
}

export default App;