const MAX_FIELD_LENGTH = 500;
const ALLOWED_SOURCE_TYPES = new Set(["contact_form", "product_quote_button"]);

function clean(value) {
  return String(value ?? "").trim().slice(0, MAX_FIELD_LENGTH);
}

export async function onRequestPost({ request, env }) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field, bots often do.
  if (clean(body.website)) {
    return Response.json({ ok: true });
  }

  const name = clean(body.name);
  const phone = clean(body.phone);
  const productName = clean(body.product_name);
  const sourceType = ALLOWED_SOURCE_TYPES.has(body.source_type) ? body.source_type : "contact_form";

  // contact_form leads must identify the visitor. product_quote_button leads
  // are anonymous by design (just a click on a WhatsApp link) and only need
  // to name the product the visitor was interested in.
  if (sourceType === "contact_form" && !name && !phone) {
    return Response.json({ ok: false, error: "missing_contact_info" }, { status: 400 });
  }

  if (sourceType === "product_quote_button" && !productName) {
    return Response.json({ ok: false, error: "missing_product_name" }, { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "ar";

  const record = {
    name,
    phone,
    governorate: clean(body.governorate),
    customer_type: clean(body.customer_type),
    category: clean(body.category),
    message: clean(body.message),
    source_page: clean(body.source_page),
    source_type: sourceType,
    product_name: productName,
    locale,
  };

  try {
    await env.DB.prepare(
      `INSERT INTO leads
        (name, phone, governorate, customer_type, category, message, source_page, source_type, product_name, locale)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        record.name,
        record.phone,
        record.governorate,
        record.customer_type,
        record.category,
        record.message,
        record.source_page,
        record.source_type,
        record.product_name,
        record.locale
      )
      .run();
  } catch (error) {
    return Response.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
