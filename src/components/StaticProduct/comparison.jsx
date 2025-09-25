import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import staticProducts from "../../data/staticProducts";

const Comparison = () => {
  const product = staticProducts[0];
  const comparison = product.comparisonData || { headers: [], rows: [] };

  const styles = {
    container: { maxWidth: 1200, margin: "0 auto", padding: "60px 20px", fontFamily: "Arial, sans-serif" },
    wrapper: { display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" },
    textBlock: { flex: "1 1 45%", minWidth: 300 },
    tableBlock: { flex: "1 1 45%", minWidth: 320, overflowX: "auto" },
    title: { fontSize: 28, fontWeight: 700, marginBottom: 16 },
    desc: { fontSize: 16, lineHeight: 1.6, color: "#555" },
    table: { borderRadius: 10, overflow: "hidden", border: "1px solid #eee", width: "100%", minWidth: 300 },
    headerRow: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", fontWeight: 600, fontSize: 16, textAlign: "center", background: "#f8f8f8", padding: "12px 0" },
    headerL: { background: "#fff5f2", color: "#d6336c", fontWeight: 700 },
    row: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", alignItems: "center", padding: "14px 10px", fontSize: 15, color: "#333", borderBottom: "1px solid #eee" },
    iconCheck: { color: "green", fontSize: 16 },
    iconX: { color: "red", fontSize: 16 },
  };

  // Responsive adjustments
  const mobileStyles = {
    wrapper: { flexDirection: "column", gap: 20 },
    headerRow: { gridTemplateColumns: "1.5fr 1fr 1fr" }, // same columns but table will scroll horizontally
    row: { gridTemplateColumns: "1.5fr 1fr 1fr" },
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.wrapper, ...(isMobile ? mobileStyles.wrapper : {}) }}>
        {/* Left column */}
        <div style={styles.textBlock}>
          <h2 style={styles.title}>{product.comparisonData?.title || "Comparison"}</h2>
          <p style={styles.desc}>
            {product.comparisonData?.description || `Elevate your routine with ${product.name}. See how LUMINEUX compares to others.`}
          </p>
        </div>

        {/* Right column – table */}
        <div style={styles.tableBlock}>
          <div style={styles.table}>
            <div style={{ ...styles.headerRow, ...(isMobile ? mobileStyles.headerRow : {}) }}>
              {comparison.headers.map((header, idx) => (
                <div key={idx} style={idx === 1 ? styles.headerL : {}}>
                  {header}
                </div>
              ))}
            </div>

            {comparison.rows.map((row, idx) => (
              <div key={idx} style={{ ...styles.row, ...(isMobile ? mobileStyles.row : {}), background: idx % 2 ? "#fafafa" : "#fff" }}>
                <div>{row.feature}</div>
                <div style={{ textAlign: "center" }}>{row.lumineux ? <FaCheck style={styles.iconCheck} /> : <FaTimes style={styles.iconX} />}</div>
                <div style={{ textAlign: "center" }}>{row.others ? <FaCheck style={styles.iconCheck} /> : <FaTimes style={styles.iconX} />}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
