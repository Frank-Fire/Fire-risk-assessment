import { CATEGORIES, scoreColor, CONDITION_COLOR } from "./data.js";

export default function Summary({ data, meta }) {
  const allItems = CATEGORIES.flatMap(c =>
    c.items.map(i => ({ ...i, category: c.label, icon: c.icon }))
  );

  const knelpunten = allItems.filter(i => data[i.id].score !== null && data[i.id].score <= 2);
  const aandacht = allItems.filter(i => data[i.id].score === 3);

  const catScores = CATEGORIES.map(cat => {
    const scored = cat.items.filter(i => data[i.id].score !== null);
    const avg = scored.length
      ? scored.reduce((s, i) => s + data[i.id].score, 0) / scored.length
      : null;
    return { ...cat, avg, filled: scored.length };
  });

  const totalScored = Object.values(data).filter(d => d.score !== null);
  const overallAvg = totalScored.length
    ? (totalScored.reduce((s, d) => s + d.score, 0) / totalScored.length).toFixed(1)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={card}>
        <div style={sectionTitle}>📋 Inspectiegegevens</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginTop: 12 }}>
          {[["Gebouw / Locatie", meta.gebouw || "—"], ["Datum", meta.datum], ["Inspecteur", meta.inspecteur || "—"]].map(([k, v]) => (
            <div key={k} style={metaBox}>
              <div style={metaLabel}>{k}</div>
              <div style={metaValue}>{v}</div>
            </div>
          ))}
          {overallAvg && (
            <div style={{ ...metaBox, background: scoreColor(parseFloat(overallAvg)) + "22", borderColor: scoreColor(parseFloat(overallAvg)) + "66" }}>
              <div style={metaLabel}>Gemiddelde score</div>
              <div style={{ ...metaValue, color: scoreColor(parseFloat(overallAvg)), fontSize: 22, fontWeight: 800 }}>{overallAvg} / 5</div>
            </div>
          )}
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>📊 Score per categorie</div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {catScores.map(cat => (
            <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 240, fontSize: 13, color: "#cbd5e1", flexShrink: 0 }}>{cat.icon} {cat.label}</div>
              <div style={{ flex: 1, background: "#0f172a", borderRadius: 99, height: 8, overflow: "hidden" }}>
                {cat.avg && <div style={{ height: "100%", width: `${(cat.avg / 5) * 100}%`, background: scoreColor(cat.avg), borderRadius: 99 }} />}
              </div>
              <div style={{ width: 36, textAlign: "right", fontSize: 14, fontWeight: 700, color: cat.avg ? scoreColor(cat.avg) : "#475569" }}>
                {cat.avg ? cat.avg.toFixed(1) : "—"}
              </div>
              <div style={{ fontSize: 11, color: "#475569", width: 64, textAlign: "right" }}>{cat.filled}/{cat.items.length}</div>
            </div>
          ))}
        </div>
      </div>

      {knelpunten.length > 0 && (
        <div style={{ ...card, borderColor: "#ef444433" }}>
          <div style={{ ...sectionTitle, color: "#fca5a5" }}>⚠️ Kritieke bevindingen (score ≤ 2)</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {knelpunten.map(item => <FindingRow key={item.id} item={item} data={data[item.id]} color="#ef4444" />)}
          </div>
        </div>
      )}

      {aandacht.length > 0 && (
        <div style={{ ...card, borderColor: "#f59e0b33" }}>
          <div style={{ ...sectionTitle, color: "#fcd34d" }}>🔶 Aandachtspunten (score 3)</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {aandacht.map(item => <FindingRow key={item.id} item={item} data={data[item.id]} color="#f59e0b" />)}
          </div>
        </div>
      )}

      {knelpunten.length === 0 && aandacht.length === 0 && totalScored.length > 0 && (
        <div style={{ ...card, borderColor: "#22c55e33", textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 32 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#86efac", marginTop: 8 }}>Geen kritieke bevindingen</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Alle beoordeelde onderdelen scoren voldoende of hoger.</div>
        </div>
      )}
    </div>
  );
}

function FindingRow({ item, data, color }) {
  return (
    <div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ background: color, color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 12, fontWeight: 700 }}>{data.score}</div>
        <div style={{ fontSize: 13, color: "#e2e8f0", flex: 1 }}>{item.omschrijving}</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>{item.icon} {item.category}</div>
      </div>
      {data.opmerking && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, paddingLeft: 8, borderLeft: `2px solid ${color}` }}>{data.opmerking}</div>
      )}
    </div>
  );
}

const card = { background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 24 };
const sectionTitle = { fontSize: 15, fontWeight: 700, color: "#f1f5f9" };
const metaBox = { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" };
const metaLabel = { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" };
const metaValue = { fontSize: 14, color: "#e2e8f0", marginTop: 4, fontWeight: 600 };
