import { createNextRouteHandler } from "@uploadthing/next";
import { uploadRouter } from "@/lib/upload";

export const { GET, POST } = createNextRouteHandler({ router: uploadRouter });
