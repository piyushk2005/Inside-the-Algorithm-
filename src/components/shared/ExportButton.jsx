import React, { useState, useRef, useEffect } from "react";
import { downloadJSON, downloadCSV, downloadSVGAsPNG } from "../../utils/exportSession";

/**
 * Drop this into any module page. Pass whatever that module knows about
 * the user's session — it doesn't care what shape `data` is.
 *
 * <ExportButton
 *   data={{ learningRate, iterations, finalLoss, startPoint }}
 *   history={path}                 // optional: array of row objects -> CSV
 *   svgRef={chartSvgRef}           // optional: ref to an <svg> to export as PNG
 *   filenamePrefix="gradient-descent"
 * />
 */
export default function ExportButton({ data, history, svgRef, filenamePrefix = "session" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  const handleExportJSON = () => {
    downloadJSON(data ?? {}, `${filenamePrefix}-${stamp()}.json`);
    setOpen(false);
  };

  const handleExportCSV = () => {
    downloadCSV(history ?? [], `${filenamePrefix}-history-${stamp()}.csv`);
    setOpen(false);
  };

  const handleExportPNG = () => {
    downloadSVGAsPNG(svgRef?.current, `${filenamePrefix}-${stamp()}.png`);
    setOpen(false);
  };

  return (
    <div className="export-button" ref={menuRef}>
      <button
        className="export-button-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
        Export
      </button>

      {open && (
        <div className="export-button-menu" role="menu">
          {data && (
            <button role="menuitem" onClick={handleExportJSON}>
              Download data (.json)
            </button>
          )}
          {history && history.length > 0 && (
            <button role="menuitem" onClick={handleExportCSV}>
              Download step history (.csv)
            </button>
          )}
          {svgRef && (
            <button role="menuitem" onClick={handleExportPNG}>
              Download chart (.png)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
