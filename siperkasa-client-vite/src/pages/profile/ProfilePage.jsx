import { useEffect, useState } from "react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/common/Loading";

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(user);
  }, [user]);

  if (!data) return <Loading />;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-green-800">Profil Saya</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Nama</label>
          <div className="p-3 border rounded-lg">{data.name}</div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <div className="p-3 border rounded-lg">{data.email}</div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Role</label>
          <div className="p-3 border rounded-lg capitalize">{data.role}</div>
        </div>
      </div>
    </div>
  );
}
