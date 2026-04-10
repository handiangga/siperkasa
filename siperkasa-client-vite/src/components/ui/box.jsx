export default function Box({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="mb-4 font-semibold text-green-800">{title}</h3>
      {children}
    </div>
  );
}
