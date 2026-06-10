import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: "ADMIN" },
    create: {
      email,
      name: "Admin",
      hashedPassword,
      role: "ADMIN"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
