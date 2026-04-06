import { Route } from "react-router-dom";
import UserPage from "../pages/UserPage";
import UserForm from "../pages/UserForm";

const userRoutes = (
  <>
    <Route path="/users" element={<UserPage />} />
    <Route path="/users/create" element={<UserForm />} />
    <Route path="/users/edit/:id" element={<UserForm />} />
  </>
);

export default userRoutes;
