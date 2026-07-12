import { requireAdminPage } from "@/lib/adminAuth";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export default async function AdminSettingsPage() {
  await requireAdminPage("users:write");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-bone">Settings</h1>
      <SettingsForm />
    </div>
  );
}
