export function highlight(text, keyword) {
  if (!text) return "";
  if (!keyword) return text;

  const parts = String(text).split(new RegExp(`(${keyword})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 px-1 rounded">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
