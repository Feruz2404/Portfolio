import { createUploadthing, type FileRouter } from "@uploadthing/next";
import { auth } from "@/lib/server-auth";

const f = createUploadthing();

export const uploadRouter = {
  media: f({ image: { maxFileSize: "8MB", maxFileCount: 10 }, pdf: { maxFileSize: "16MB", maxFileCount: 5 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: (session.user as any).id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key, name: file.name, size: file.size, type: file.type };
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
