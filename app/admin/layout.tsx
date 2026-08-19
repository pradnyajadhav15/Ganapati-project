import AdminNav from "@/components/AdminNav";
import { logout } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav logout={logout} />
      {children}
    </>
  );
}
