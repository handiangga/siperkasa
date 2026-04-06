export default function Tooltip({ text, children }) {
  return (
    <div className="relative group inline-block">
      {children}

      <div
        className="
        absolute bottom-full mb-2 left-1/2 -translate-x-1/2
        bg-black text-white text-xs px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition duration-200 whitespace-nowrap
        pointer-events-none
      "
      >
        {text}
      </div>
    </div>
  );
}
