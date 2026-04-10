export default function TopJaksa({ data, navigate }) {
  return (
    <div className="bg-white p-6 mt-6 rounded shadow">
      <h3 className="font-semibold mb-4 text-green-800">Top Jaksa</h3>

      {data.map((j, i) => (
        <div
          key={j.id}
          onClick={() => navigate(`/jaksa/${j.id}`)}
          className={`flex justify-between p-2 rounded cursor-pointer
            ${i === 0 ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"}`}
        >
          <span>
            {i === 0 && "🥇 "}
            {i === 1 && "🥈 "}
            {i === 2 && "🥉 "}
            {j.nama}
          </span>

          <span className="bg-green-100 text-green-700 px-2 rounded">
            {j.total}
          </span>
        </div>
      ))}
    </div>
  );
}
