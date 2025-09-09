export default function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium bg-white">
      {children}
    </span>
  );
}
