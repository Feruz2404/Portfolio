import { signIn } from "@/lib/auth";

export default function LoginPage() {
  async function action(formData: FormData) {
    "use server";
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin/dashboard",
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form action={action} className="mt-6 grid gap-3">
        <input className="rounded-md border border-border bg-background px-3 py-2" name="email" type="email" placeholder="email" required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="password" type="password" placeholder="password" required />
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Sign in</button>
      </form>
    </div>
  );
}
