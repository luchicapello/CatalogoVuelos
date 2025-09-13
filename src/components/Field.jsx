export default function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white">{label}</span>
      {children}
    </label>
  );
}
