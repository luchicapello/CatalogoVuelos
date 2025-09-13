export default function Pill({ children, variant = "default" }) {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case "success":
        return "border-green-500 bg-green-900/30 text-green-300";
      case "warning":
        return "border-yellow-500 bg-yellow-900/30 text-yellow-300";
      case "error":
        return "border-red-500 bg-red-900/30 text-red-300";
      case "info":
        return "border-blue-500 bg-blue-900/30 text-blue-300";
      default:
        return "border-gray-600 bg-gray-700 text-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full border px-2 sm:px-2.5 py-1 text-xs font-medium whitespace-nowrap min-w-[80px] ${getVariantClasses(variant)}`}>
      {children}
    </span>
  );
}
