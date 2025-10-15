import { useEffect, useState } from "react";

function App() {
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/primeraconexion")
      .then((res) => res.text())
      .then((data) => setSaludo(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Conexion al Backend</h1>
      <p>{saludo}</p>
    </div>
  );
}

export default App;
