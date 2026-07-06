import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminSettingsPage() {
  await requireAdminPage("users:write");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
    </div>
  );
}
