export async function onRequestPatch({ request, env, params }) {
  // Auth is enforced by functions/api/admin/_middleware.js for every route
  // under /api/admin/*, so this handler can assume the session is valid.
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const contacted = body.contacted ? 1 : 0;

  try {
    await env.DB.prepare("UPDATE leads SET contacted = ? WHERE id = ?").bind(contacted, id).run();
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}
