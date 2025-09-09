import { useState } from "react";
import Field from "../components/Field";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Fake auth for demo
    if (email && password.length >= 6) {
      setMsg("Inicio de sesión exitoso (demo)");
    } else {
      setMsg("Revisá tus credenciales (mín. 6 caracteres)");
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Iniciar sesión</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded-2xl p-6 bg-white"
      >
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-gray-900 text-white"
        >
          Entrar
        </button>
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
      </form>
    </main>
  );
}
