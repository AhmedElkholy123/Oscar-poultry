const form = document.getElementById("admin-login-form");
const errorMessage = document.getElementById("admin-login-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.hidden = true;

  const password = String(new FormData(form).get("password") || "");
  const submitButton = form.querySelector("button[type='submit']");

  submitButton.disabled = true;

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      window.location.href = "/admin/";
      return;
    }
  } catch {
    // fall through to the generic error message below
  }

  submitButton.disabled = false;
  errorMessage.hidden = false;
  form.reset();
});
