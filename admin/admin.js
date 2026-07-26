const sinceFilter = document.getElementById("admin-since-filter");
const contactedFilter = document.getElementById("admin-contacted-filter");
const refreshButton = document.getElementById("admin-refresh");
const leadsBody = document.getElementById("admin-leads-body");

const SOURCE_LABELS = {
  contact_form: "نموذج التواصل",
  product_quote_button: "زرار طلب سعر منتج",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value.replace(" ", "T")}Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

function buildDetails(lead) {
  const parts = [];

  if (lead.governorate) parts.push(lead.governorate);
  if (lead.customer_type) parts.push(lead.customer_type);
  if (lead.message) parts.push(lead.message);

  return parts.join(" — ");
}

function renderLeads(leads) {
  if (!leads.length) {
    leadsBody.innerHTML = `<tr><td colspan="7" class="admin-leads-empty">لا يوجد طلبات مطابقة</td></tr>`;
    return;
  }

  leadsBody.innerHTML = leads
    .map((lead) => {
      const sourceLabel = SOURCE_LABELS[lead.source_type] || lead.source_type || "";
      const categoryOrProduct = [lead.category, lead.product_name].filter(Boolean).join(" / ");

      return `
        <tr data-lead-id="${lead.id}">
          <td>${escapeHtml(formatDate(lead.created_at))}</td>
          <td>${escapeHtml(lead.name)}</td>
          <td>${lead.phone ? `<a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a>` : ""}</td>
          <td>${escapeHtml(sourceLabel)}</td>
          <td>${escapeHtml(categoryOrProduct)}</td>
          <td>${escapeHtml(buildDetails(lead))}</td>
          <td>
            <label class="lead-status-toggle">
              <input type="checkbox" class="admin-contacted-checkbox" ${lead.contacted ? "checked" : ""}>
              تم التواصل
            </label>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function loadLeads() {
  leadsBody.innerHTML = `<tr><td colspan="7" class="admin-leads-empty">جاري التحميل...</td></tr>`;

  const params = new URLSearchParams();

  if (sinceFilter.value) {
    params.set("since", sinceFilter.value);
  }

  if (contactedFilter.value) {
    params.set("contacted", contactedFilter.value);
  }

  try {
    const response = await fetch(`/api/admin/leads?${params.toString()}`);

    if (response.status === 401) {
      window.location.href = "/admin/login.html";
      return;
    }

    const data = await response.json();

    if (!response.ok || !data.ok) {
      leadsBody.innerHTML = `<tr><td colspan="7" class="admin-leads-empty">تعذر تحميل الطلبات</td></tr>`;
      return;
    }

    renderLeads(data.leads || []);
  } catch {
    leadsBody.innerHTML = `<tr><td colspan="7" class="admin-leads-empty">تعذر الاتصال بالسيرفر</td></tr>`;
  }
}

async function toggleContacted(id, contacted) {
  try {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted }),
    });
  } catch {
    // Best-effort; the checkbox already reflects the intended state.
  }
}

refreshButton.addEventListener("click", loadLeads);
sinceFilter.addEventListener("change", loadLeads);
contactedFilter.addEventListener("change", loadLeads);

const logoutButton = document.getElementById("admin-logout");

logoutButton?.addEventListener("click", async () => {
  try {
    await fetch("/api/admin/logout", { method: "POST" });
  } catch {
    // ignore; redirecting to the login page either way
  }

  window.location.href = "/admin/login.html";
});

leadsBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".admin-contacted-checkbox");

  if (!checkbox) {
    return;
  }

  const row = checkbox.closest("tr[data-lead-id]");
  const id = row?.dataset.leadId;

  if (id) {
    toggleContacted(id, checkbox.checked);
  }
});

loadLeads();
