export default function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold text-green-800">{value}</h3>
    </div>
  );
}
