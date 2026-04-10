export default function Empty({ text = "Data kosong" }) {
  return (
    <div className="text-center py-10 text-gray-400">
      {text}
    </div>
  );
}