import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals, redirect }) => {
  locals.pb.authStore.clear();
  return redirect("/login");
};