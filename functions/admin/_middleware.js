import { isSessionValid } from "../_shared/auth.js";

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/admin/login")) {
    return next();
  }

  const valid = await isSessionValid(request, env.SESSION_SECRET);

  if (!valid) {
    return Response.redirect(`${url.origin}/admin/login.html`, 302);
  }

  return next();
}
