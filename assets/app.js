const path = window.location.pathname.replace(/\/$/, "");
const segments = path.split("/").filter(Boolean);
const current = segments.at(-1) || "scaner-wins";

document.querySelectorAll("[data-route]").forEach((link) => {
  const route = link.getAttribute("data-route");
  if (route === current) {
    link.classList.add("active");
  }
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

function pillClass(value) {
  if (!value) return "blue";
  const normalized = String(value).toLowerCase();
  if (normalized.includes("very") || normalized.includes("strong") || normalized.includes("pre-breakout")) {
    return "green";
  }
  if (normalized.includes("htf") || normalized.includes("active")) {
    return "orange";
  }
  if (normalized.includes("risk") || normalized.includes("severe")) {
    return "red";
  }
  return "blue";
}

async function hydrateTable(apiPath, renderer) {
  const mount = document.querySelector(`[data-api-table="${apiPath}"]`);
  if (!mount) return;

  try {
    const response = await fetch(apiPath);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const payload = await response.json();
    mount.innerHTML = renderer(payload);
  } catch (error) {
    mount.innerHTML = `<tr><td colspan="9">Unable to load data right now.</td></tr>`;
    console.error(error);
  }
}

if (current === "scaner-wins") {
  hydrateTable("/api/scanner-wins", (payload) =>
    payload.items
      .map(
        (item) => `
          <tr>
            <td>#${item.rank}</td>
            <td><strong>${item.symbol}</strong><div class="muted small">${item.company}</div></td>
            <td><span class="pill ${pillClass(item.identifiedBy)}">${item.identifiedBy}</span></td>
            <td>${item.identifiedOn}</td>
            <td>${item.priceThen}</td>
            <td>${item.bestPrice}</td>
            <td class="score">${item.moved}</td>
          </tr>
        `
      )
      .join("")
  );
}

if (current === "pre-breakout") {
  hydrateTable("/api/pre-breakout", (payload) =>
    payload.items
      .map(
        (item) => `
          <tr>
            <td><strong>${item.symbol}</strong><div class="muted small">${item.company}</div></td>
            <td class="score">${item.score}</td>
            <td><span class="pill ${pillClass(item.signal)}">${item.signal}</span></td>
            <td>${item.fromPivot}</td>
            <td>${item.stage}</td>
            <td>${item.rsRank}</td>
            <td>${item.base}</td>
            <td>${item.volume}</td>
            <td>${item.risk}</td>
          </tr>
        `
      )
      .join("")
  );
}

if (current === "breakouts") {
  hydrateTable("/api/breakouts", (payload) =>
    payload.items
      .map(
        (item) => `
          <tr>
            <td><strong>${item.symbol}</strong><div class="muted small">${item.company}</div></td>
            <td class="score">${item.score}</td>
            <td><span class="pill ${pillClass(item.pattern)}">${item.pattern}</span></td>
            <td><span class="pill ${pillClass(item.signal)}">${item.signal}</span></td>
            <td>${item.gain10d}</td>
            <td>${item.vol50d}</td>
            <td>${item.rs}</td>
            <td>${item.from52wH}</td>
          </tr>
        `
      )
      .join("")
  );
}

if (current === "breakdowns") {
  hydrateTable("/api/breakdowns", (payload) => {
    if (!payload.items.length) {
      return `
        <tr>
          <td><strong>None today</strong><div class="muted small">Downside model waiting for a refresh</div></td>
          <td>—</td>
          <td><span class="pill blue">Neutral</span></td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
        </tr>
      `;
    }

    return payload.items
      .map(
        (item) => `
          <tr>
            <td><strong>${item.symbol}</strong><div class="muted small">${item.company}</div></td>
            <td>${item.riskScore}</td>
            <td><span class="pill ${pillClass(item.risk)}">${item.risk}</span></td>
            <td>${item.pattern}</td>
            <td>${item.support}</td>
            <td>${item.dmaState}</td>
            <td>${item.distribution}</td>
          </tr>
        `
      )
      .join("");
  });
}
