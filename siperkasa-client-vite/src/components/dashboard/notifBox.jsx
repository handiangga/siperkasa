import { FaBell } from "react-icons/fa";

export default function NotifBox({ notif }) {
  if (!notif) return null;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FaBell />
        <b>Notifikasi</b>
      </div>

      {/* SPDP */}
      {notif.spdp?.length > 0 &&
        notif.spdp.map((n) => (
          <p key={n.id} className="text-sm mb-1">
            📄 SPDP baru: {n.nomor_spdp}
          </p>
        ))}

      {/* P16 */}
      {notif.p16?.length > 0 &&
        notif.p16.map((n) => (
          <p key={n.id} className="text-sm mb-1">
            ⚖️ Penunjukan jaksa baru
          </p>
        ))}

      {/* kosong */}
      {!notif.spdp?.length && !notif.p16?.length && (
        <p className="text-gray-400 text-sm">Tidak ada notifikasi</p>
      )}
    </div>
  );
}
