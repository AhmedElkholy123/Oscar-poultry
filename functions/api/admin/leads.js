export async function onRequestGet({ request, env }) {
  // Auth is enforced by functions/api/admin/_middleware.js for every route
  // under /api/admin/*, so this handler can assume the session is valid.
  const url = new URL(request.url);
  const since = url.searchParams.get("since");
  const contactedParam = url.searchParams.get("contacted");
  const contacted = contactedParam === "0" || contactedParam === "1" ? Number(contactedParam) : null;

  let query = "SELECT * FROM leads WHERE 1 = 1";
  const bindings = [];

  if (since) {
    query += " AND created_at >= ?";
    bindings.push(since);
  }

  if (contacted !== null) {
    query += " AND contacted = ?";
    bindings.push(contacted);
  }

  query += " ORDER BY created_at DESC LIMIT 200";

  try {
    const { results } = await env.DB.prepare(query)
      .bind(...bindings)
      .all();

    return Response.json({ ok: true, leads: results });
  } catch (error) {
    return Response.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}
