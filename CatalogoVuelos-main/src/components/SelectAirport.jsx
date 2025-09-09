export default function SelectAirport({ value, onChange, placeholder }) {
  const AIRPORTS = [
    { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini" },
    { code: "AEP", city: "Buenos Aires", name: "Aeroparque" },
    { code: "SCL", city: "Santiago", name: "Arturo Merino Benítez" },
    { code: "GRU", city: "São Paulo", name: "Guarulhos" },
    { code: "MIA", city: "Miami", name: "International" },
    { code: "MAD", city: "Madrid", name: "Barajas" },
    { code: "BCN", city: "Barcelona", name: "El Prat" },
    { code: "FCO", city: "Rome", name: "Fiumicino" },
    { code: "JFK", city: "New York", name: "JFK" },
    { code: "LAX", city: "Los Angeles", name: "LAX" },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-900"
    >
      <option value="">{placeholder}</option>
      {AIRPORTS.map((a) => (
        <option
          key={a.code}
          value={a.code}
        >
          {a.city} ({a.code}) — {a.name}
        </option>
      ))}
    </select>
  );
}
