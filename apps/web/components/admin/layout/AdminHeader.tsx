import { signOut } from "@/lib/auth";

export function AdminHeader() {
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-sm text-muted-foreground">Enterprise Portfolio Admin</div>
        <form action={logout}>
          <button className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-semibold hover:bg-secondary/80">Logout</button>
        </form>
      </div>
    </header>
  );
}
