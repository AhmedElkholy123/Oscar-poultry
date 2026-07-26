import { isSessionValid } from "../../_shared/auth.js";

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);

  if (url.pathname === "/api/admin/login") {
    return next();
  }

  const valid = await isSessionValid(request, env.SESSION_SECRET);

  if (!valid) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return next();
}
