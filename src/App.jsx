import { useState, useEffect, useCallback } from "react";
import { CATEGORIES, SCORES, CONDITIONS, CONDITION_COLOR, scoreColor, buildInitialData } from "./data.js";
import { useLocalStorage } from "./useLocalStorage.js";
import Summary from "./Summary.jsx";

const STORAGE_KEY = "fra_data_v1";
const META_KEY = "fra_meta_v1";

export default function App() {
  const [data, setData] = useLocalStorage(STORAGE_KEY, buildInitialData());
  const [meta, setMeta] = useLocalStorage(META_KEY, {
    gebouw: "", inspecteur: "", datum: new Date().toISOString().split("T")[0],
  });
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSavedAt(new Date().toLocaleTimeString("nl-NL")), 300);
    return () => clearTimeout(t);
  }, [data, meta]);

  const updateItem = useCallback((itemId, field, value) => {
    setData(prev => ({ ...prev, [itemId]: { ...prev[itemId], [field]: value } }));
  }, [setData]);

  const updateMeta = (field, value) => setMeta(prev => ({ ...prev, [field]: value }));

  const totalItems = Object.keys(data).length;
  const filledItems = Object.values(data).filter(d => d.score !== null).length;
  const progress = Math.round((filledItems / totalItems) * 100);
  const scored = Object.values(data).filter(d => d.score !== null);
  const avgScore = scored.length
    ? (scored.reduce((s, d) => s + d.score, 0) / scored.length).toFixed(1)
    : null;

  const catProgress = cat => {
    const filled = cat.items.filter(i => data[i.id]?.score !== null).length;
    return Math.round((filled / cat.items.length) * 100);
  };

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  const handleReset = () => {
    setData(buildInitialData());
    setMeta({ gebouw: "", inspecteur: "", datum: new Date().toISOString().split("T")[0] });
    setConfirmReset(false);
    setExpandedItem(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
      <div style={{ background: "linear-gradient(135deg,#1e293b,#0f172a)", borderBottom: "1px solid #334155", padding: "20px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 28 }}>🔥</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>Fire Risk Assessment</div>
              <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Brandveiligheid Inspectie Formulier</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {savedAt && (
                <span style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  Opgeslagen {savedAt}
                </span>
              )}
              <button onClick={() => setShowSummary(!showSummary)} style={showSummary ? btnRed : btnBlue}>
                {showSummary ? "← Checklist" : "📊 Samenvatting"}
              </button>
              <button onClick={() => setConfirmReset(true)} style={btnGhost}>🗑 Reset</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { key: "gebouw", label: "Gebouw / Locatie", placeholder: "Gebouwnaam of adres", type: "text" },
              { key: "datum", label: "Datum", placeholder: "", type: "date" },
              { key: "inspecteur", label: "Inspecteur", placeholder: "Naam inspecteur", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ flex: "1 1 160px" }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{f.label}</div>
                <input type={f.type} value={meta[f.key]} onChange={e => updateMeta(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, background: "#1e293b", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#3b82f6,#22c55e)", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{filledItems}/{totalItems} ({progress}%)</span>
            {avgScore && <div style={{ background: scoreColor(parseFloat(avgScore)), color: "#fff", borderRadius: 6, padding: "2px 12px", fontSize: 13, fontWeight: 700 }}>Gem. {avgScore}</div>}
          </div>
        </div>
      </div>

      {confirmReset && (
        <div style={{ position: "fixed", inset: 0, background: "#0008", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1e293b", border: "1px solid #475569", borderRadius: 14, padding: 32, maxWidth: 380, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Formulier resetten?</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8, marginBottom: 24 }}>Alle ingevulde scores, condities en opmerkingen worden gewist.</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmReset(false)} style={btnGhost}>Annuleren</button>
              <button onClick={handleReset} style={btnRed}>Ja, alles wissen</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        {showSummary ? (
          <Summary data={data} meta={meta} />
        ) : (
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 220, flexShrink: 0 }}>
              {CATEGORIES.map(cat => {
                const pct = catProgress(cat);
                const active = cat.id === activeCategory;
                return (
                  <div key={cat.id} onClick={() => { setActiveCategory(cat.id); setExpandedItem(null); }}
                    style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 10, cursor: "pointer", background: active ? "#1e40af" : "#1e293b", border: `1px solid ${active ? "#3b82f6" : "#334155"}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? "#bfdbfe" : "#cbd5e1" }}>{cat.icon} {cat.label}</div>
                    <div style={{ marginTop: 6, background: "#0f172a", borderRadius: 99, height: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#3b82f6", borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>{pct}% ingevuld</div>
                  </div>
                );
              })}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>{currentCat.icon} {currentCat.label}</div>
              {currentCat.items.map((item, idx) => {
                const d = data[item.id] || { score: null, conditie: null, opmerking: "" };
                const isOpen = expandedItem === item.id;
                return (
                  <div key={item.id} style={{ background: "#1e293b", border: `1px solid ${isOpen ? "#3b82f6" : "#334155"}`, borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
                    <div onClick={() => setExpandedItem(isOpen ? null : item.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#64748b", flexShrink: 0 }}>{idx + 1}</div>
                      <div style={{ flex: 1, fontSize: 14, color: "#e2e8f0" }}>{item.omschrijving}</div>
                      {d.score
                        ? <div style={{ background: scoreColor(d.score), color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{d.score}</div>
                        : <div style={{ background: "#334155", color: "#64748b", borderRadius: 6, padding: "2px 10px", fontSize: 12, flexShrink: 0 }}>—</div>}
                      {d.conditie
                        ? <div style={{ background: CONDITION_COLOR[d.conditie] + "22", color: CONDITION_COLOR[d.conditie], borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 600, border: `1px solid ${CONDITION_COLOR[d.conditie]}44`, flexShrink: 0 }}>{d.conditie}</div>
                        : <div style={{ background: "#334155", color: "#64748b", borderRadius: 6, padding: "2px 10px", fontSize: 12, flexShrink: 0 }}>conditie</div>}
                      <div style={{ color: "#475569", fontSize: 12, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▼</div>
                    </div>
                    {isOpen && (
                      <div style={{ borderTop: "1px solid #334155", padding: 16, background: "#0f172a" }}>
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                          <div>
                            <div style={detailLabel}>Score (1–5)</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                              {SCORES.map(s => (
                                <button key={s} onClick={() => updateItem(item.id, "score", d.score === s ? null : s)}
                                  style={{ width: 38, height: 38, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: d.score === s ? scoreColor(s) : "#1e293b", color: d.score === s ? "#fff" : "#94a3b8", outline: d.score === s ? `2px solid ${scoreColor(s)}` : "2px solid transparent" }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                            <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>1 = zeer slecht · 5 = uitstekend</div>
                          </div>
                          <div>
                            <div style={detailLabel}>Conditie</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                              {CONDITIONS.map(c => (
                                <button key={c} onClick={() => updateItem(item.id, "conditie", d.conditie === c ? null : c)}
                                  style={{ padding: "6px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${d.conditie === c ? CONDITION_COLOR[c] : "#334155"}`, background: d.conditie === c ? CONDITION_COLOR[c] + "22" : "transparent", color: d.conditie === c ? CONDITION_COLOR[c] : "#64748b", fontSize: 12, fontWeight: 600 }}>
                                  {c}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                          <div style={detailLabel}>Opmerking / Actie vereist</div>
                          <textarea value={d.opmerking} onChange={e => updateItem(item.id, "opmerking", e.target.value)}
                            placeholder="Noteer bevindingen, tekortkomingen of vereiste acties..." rows={3}
                            style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: 10, color: "#e2e8f0", fontSize: 13, marginTop: 6, outline: "none" }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, outline: "none" };
const detailLabel = { fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" };
const btnBlue = { background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const btnRed = { background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const btnGhost = { background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
