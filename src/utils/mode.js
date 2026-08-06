export function setMode(mode) {
  localStorage.setItem("ita_mode", mode);
}

export function getMode() {
  return localStorage.getItem("ita_mode") || "guided";
}