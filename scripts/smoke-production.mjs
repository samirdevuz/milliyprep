const baseUrl = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(
  /\/+$/,
  ""
);

let failed = false;

function result(ok, name, detail = "") {
  const status = ok ? "OK  " : "FAIL";
  console.log(`${status} ${name}${detail ? ` - ${detail}` : ""}`);
  if (!ok) failed = true;
}

async function request(path, init) {
  try {
    return await fetch(`${baseUrl}${path}`, init);
  } catch (error) {
    result(false, path, error instanceof Error ? error.message : "network error");
    return undefined;
  }
}

console.log(`MilliyPrep smoke check: ${baseUrl}\n`);

const home = await request("/");
result(home?.status === 200, "Landing responds", `HTTP ${home?.status ?? "?"}`);
result(
  Boolean(home?.headers.get("content-security-policy")?.includes("frame-ancestors 'none'")),
  "Content Security Policy"
);
result(home?.headers.get("x-content-type-options") === "nosniff", "Security headers");

const dashboard = await request("/dashboard", { redirect: "manual" });
const dashboardLocation = dashboard?.headers.get("location") ?? "";
result(
  Boolean(
    dashboard &&
      [307, 308].includes(dashboard.status) &&
      dashboardLocation.includes("/login?next=")
  ),
  "Dashboard rejects anonymous access",
  `HTTP ${dashboard?.status ?? "?"}`
);

const payment = await request("/api/payments/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ plan: "pro", billing: "monthly", provider: "click" }),
});
const paymentBody = await payment?.json().catch(() => ({}));
result(
  payment?.status === 401 && typeof paymentBody?.registerUrl === "string",
  "Anonymous payment redirects to registration",
  `HTTP ${payment?.status ?? "?"}`
);

const practice = await request("/api/practice/attempts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
result(
  practice?.status === 401,
  "Practice API requires a session",
  `HTTP ${practice?.status ?? "?"}`
);

const health = await request("/api/health");
const healthBody = await health?.json().catch(() => ({}));
result(
  health?.status === 200 && healthBody?.status === "ok",
  "Database readiness",
  `HTTP ${health?.status ?? "?"}, ${healthBody?.database ?? "unknown"}`
);

console.log("");
if (failed) {
  console.error("Smoke check failed.");
  process.exit(1);
}
console.log("Smoke check passed.");

