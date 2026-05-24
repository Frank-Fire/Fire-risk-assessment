export const CATEGORIES = [
  {
    id: "vluchtwegen",
    label: "Vluchtwegen & Nooduitgangen",
    icon: "🚪",
    items: [
      { id: "v1", omschrijving: "Nooduitgangen vrij en bereikbaar" },
      { id: "v2", omschrijving: "Noodverlichting functioneel" },
      { id: "v3", omschrijving: "Vluchtrouteaanduiding aanwezig en leesbaar" },
      { id: "v4", omschrijving: "Deuren zelfsluitend en vrij van obstakels" },
      { id: "v5", omschrijving: "Breedte vluchtwegen conform norm (min. 0,85 m)" },
    ],
  },
  {
    id: "brandmelding",
    label: "Brandmelding & Alarmering",
    icon: "🔔",
    items: [
      { id: "b1", omschrijving: "Brandmeldinstallatie aanwezig en gekeurd" },
      { id: "b2", omschrijving: "Rookmelders operationeel en correct geplaatst" },
      { id: "b3", omschrijving: "Handmelders (MHI) vrij toegankelijk" },
      { id: "b4", omschrijving: "Alarmering hoorbaar in geheel pand" },
      { id: "b5", omschrijving: "Doormelding brandweer getest" },
    ],
  },
  {
    id: "blusmiddelen",
    label: "Blusmiddelen",
    icon: "🧯",
    items: [
      { id: "bl1", omschrijving: "Brandblusser aanwezig en gekeurd (max. 1 jaar)" },
      { id: "bl2", omschrijving: "Juist type blusser voor aanwezige brandrisico's" },
      { id: "bl3", omschrijving: "Blusmiddelen zichtbaar en vrij bereikbaar" },
      { id: "bl4", omschrijving: "Brandslangkast aanwezig en functioneel" },
      { id: "bl5", omschrijving: "Personeel geïnstrueerd in gebruik blusmiddelen" },
    ],
  },
  {
    id: "compartimentering",
    label: "Brandcompartimentering",
    icon: "🧱",
    items: [
      { id: "c1", omschrijving: "Brandwerende deuren functioneel en zelfsluitend" },
      { id: "c2", omschrijving: "Doorvoeringen (leidingen, kabels) brandwerend gedicht" },
      { id: "c3", omschrijving: "Plafonds en wanden brandwerend conform bestemming" },
      { id: "c4", omschrijving: "Geen ongeoorloofde openingen in brandscheidingen" },
    ],
  },
  {
    id: "elektra",
    label: "Elektra & Technische Installaties",
    icon: "⚡",
    items: [
      { id: "e1", omschrijving: "Elektrische installatie gekeurd (NEN 3140)" },
      { id: "e2", omschrijving: "Geen overbelasting van stopcontacten / verlengsnoeren" },
      { id: "e3", omschrijving: "Schakelkasten vrij van brandbaar materiaal" },
      { id: "e4", omschrijving: "Gasinstallatie gekeurd en lekvrij" },
      { id: "e5", omschrijving: "Verwarmingsinstallatie vrij van brandbare stoffen" },
    ],
  },
  {
    id: "opslag",
    label: "Opslag & Gevaarlijke Stoffen",
    icon: "📦",
    items: [
      { id: "o1", omschrijving: "Brandbare stoffen veilig opgeslagen" },
      { id: "o2", omschrijving: "Opslaghoeveelheden binnen toegestane normen" },
      { id: "o3", omschrijving: "Gevaarlijke stoffen voorzien van veiligheidsinformatieblad" },
      { id: "o4", omschrijving: "Geen stapeling die vluchtwegen belemmert" },
    ],
  },
  {
    id: "organisatie",
    label: "Organisatie & BHV",
    icon: "👷",
    items: [
      { id: "org1", omschrijving: "BHV-plan aanwezig en actueel" },
      { id: "org2", omschrijving: "Voldoende BHV'ers aanwezig met geldig certificaat" },
      { id: "org3", omschrijving: "Ontruimingsplan zichtbaar opgehangen" },
      { id: "org4", omschrijving: "Ontruimingsoefening gehouden (min. 1× per jaar)" },
      { id: "org5", omschrijving: "Brandveiligheidsreglement bekend bij personeel" },
    ],
  },
  {
    id: "toegang",
    label: "Bereikbaarheid Brandweer",
    icon: "🚒",
    items: [
      { id: "t1", omschrijving: "Brandweeringang vrij en gemarkeerd" },
      { id: "t2", omschrijving: "Opstelplaats brandweervoertuigen vrij" },
      { id: "t3", omschrijving: "Brandkraan of -put bereikbaar en gemarkeerd" },
      { id: "t4", omschrijving: "Gebouwplattegrond beschikbaar voor brandweer" },
    ],
  },
];

export const SCORES = [1, 2, 3, 4, 5];
export const CONDITIONS = ["Goed", "Voldoende", "Matig", "Onvoldoende", "N.v.t."];

export const CONDITION_COLOR = {
  Goed: "#22c55e",
  Voldoende: "#84cc16",
  Matig: "#f59e0b",
  Onvoldoende: "#ef4444",
  "N.v.t.": "#94a3b8",
};

export function scoreColor(score) {
  if (!score) return "#334155";
  if (score >= 4) return "#22c55e";
  if (score === 3) return "#f59e0b";
  return "#ef4444";
}

export function buildInitialData() {
  const d = {};
  CATEGORIES.forEach(cat =>
    cat.items.forEach(item => {
      d[item.id] = { score: null, conditie: null, opmerking: "" };
    })
  );
  return d;
}
