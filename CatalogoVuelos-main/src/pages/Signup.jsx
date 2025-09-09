import { useState } from "react";
import Field from "../components/Field";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6 || !form.terms) {
      setMsg("Completá todos los campos y aceptá los términos.");
      return;
    }
    setMsg("Cuenta creada (demo)");
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Crear cuenta</h1>
      <form
        onSubmit={submit}
        className="space-y-4 border rounded-2xl p-6 bg-white"
      >
        <Field label="Nombre">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Tu nombre"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="tu@email.com"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            placeholder="Mínimo 6 caracteres"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
          />
        </Field>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) =>
              setForm((f) => ({ ...f, terms: e.target.checked }))
            }
          />
          Acepto los términos y condiciones
        </label>
        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-gray-900 text-white"
        >
          Crear cuenta
        </button>
        {msg && <p className="text-sm text-center text-gray-700">{msg}</p>}
      </form>
    </main>
  );
}
