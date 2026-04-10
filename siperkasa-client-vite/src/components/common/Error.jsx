export default function Error({ text = "Terjadi kesalahan" }) {
  return <div className="text-center py-10 text-red-500">{text}</div>;
}
