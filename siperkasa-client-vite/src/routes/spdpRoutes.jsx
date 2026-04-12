import SpdpPage from "../pages/spdp/SpdpPage";
import SpdpCreate from "../pages/spdp/SpdpCreate";
import SpdpDetail from "../pages/spdp/SpdpDetail";
import SpdpEdit from "../pages/spdp/SpdpEdit";

export default function SpdpRoutes(user) {
  return [
    <Route key="spdp" path="/spdp" element={<SpdpPage />} />,
    <Route key="spdp-detail" path="/spdp/:id" element={<SpdpDetail />} />,

    ["admin", "operator"].includes(user?.role) && (
      <Route key="spdp-create" path="/spdp/create" element={<SpdpCreate />} />
    ),

    user?.role === "admin" && (
      <Route key="spdp-edit" path="/spdp/edit/:id" element={<SpdpEdit />} />
    ),
  ];
}
