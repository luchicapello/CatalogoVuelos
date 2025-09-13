import { AIRPORTS } from "../constants/airports";

export default function SelectAirport({ value, onChange, placeholder }) {

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 px-3 outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
    >
      <option value="" className="bg-gray-700 text-gray-100">{placeholder}</option>
      {AIRPORTS.map((a) => (
        <option
          key={a.code}
          value={a.code}
          className="bg-gray-700 text-gray-100"
        >
          {a.city} ({a.code}) — {a.name}
        </option>
      ))}
    </select>
  );
}
