function isAuthorized(request) {
  // Cloudflare Access already blocks unauthenticated requests to /admin* and
  // /api/admin/* at the edge. This header check is defense-in-depth in case
  // the Access policy path is ever misconfigured to miss this route.
  return Boolean(request.headers.get("Cf-Access-Authenticated-User-Email"));
}

export async function onRequestGet({ request, env }) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

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
