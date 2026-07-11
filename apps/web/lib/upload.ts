import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authorize } from "@/lib/adminAuth";

const f = createUploadthing();

export const uploadRouter = {
  media: f({ image: { maxFileSize: "8MB", maxFileCount: 10 }, pdf: { maxFileSize: "16MB", maxFileCount: 5 } })
    .middleware(async () => {
      const gate = await authorize("media:write");
      if (!gate.authorized) throw new Error(gate.response.status === 401 ? "Unauthorized" : "Forbidden");
      return { userId: gate.session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key, name: file.name, size: file.size, type: file.type };
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
