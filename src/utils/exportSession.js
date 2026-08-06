// Small, dependency-free export helpers. No libraries needed —
// everything here uses browser-native Blob / canvas APIs.

/**
 * Downloads a plain JS object as a formatted .json file.
 */
export function downloadJSON(data, filename = "session.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, filename);
}

/**
 * Downloads an array of flat objects as a .csv file.
 * Useful for step-by-step histories (iteration, loss, position, etc).
 */
export function downloadCSV(rows, filename = "history.csv") {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => row[h]).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  triggerDownload(blob, filename);
}

/**
 * Serializes an on-page <svg> element to a PNG and downloads it.
 * Pass the actual SVG DOM node (e.g. via a ref).
 */
export function downloadSVGAsPNG(svgEl, filename = "chart.png", scale = 2) {
  if (!svgEl) return;

  const clone = svgEl.cloneNode(true);
  const bbox = svgEl.viewBox.baseVal;
  const width = (bbox && bbox.width) || svgEl.clientWidth || 600;
  const height = (bbox && bbox.height) || svgEl.clientHeight || 600;

  // Inline the current background so the PNG isn't transparent-on-transparent.
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--panel") || "#12161F";
  clone.setAttribute("style", `background:${bg.trim()}`);

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bg.trim() || "#12161F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      if (blob) triggerDownload(blob, filename);
    }, "image/png");
  };
  img.src = url;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
