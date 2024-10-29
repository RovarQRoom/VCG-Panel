import { createUploadthing, type FileRouter } from "uploadthing/server";
import { supabase } from "$lib/Supabase/supabase";

const f = createUploadthing();

// Verify auth using Supabase session
const auth = async (req: Request) => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

export const ourFileRouter = {
  // Image upload route with multiple file support
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { fileUrl: file.url };
    }),

  // Video upload route
  videoUploader: f({ video: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
