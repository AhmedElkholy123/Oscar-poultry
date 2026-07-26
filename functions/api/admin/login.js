import { createSessionCookie } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const password = String(body.password || "");

  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  if (password !== env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  const cookie = await createSessionCookie(env.SESSION_SECRET);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
}
