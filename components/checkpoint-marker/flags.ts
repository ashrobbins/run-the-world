/**
 * Stylized, simplified flag renderings for a small circular UI marker — not
 * vexillologically precise. Most flags reduce to horizontal/vertical color bands, a
 * Nordic/Swiss-style cross, or bands plus one small emblem dot; a handful of
 * genuinely unique shapes (UK, USA, Turkey, Australia, Singapore) are hand-drawn
 * instead. See flag-renderer.tsx for how each `kind` is turned into SVG.
 */

export interface DotEmblem {
  color: string;
  top: number; // percent
  left: number; // percent
  size: number; // fraction of marker size, e.g. 0.3
}

export type FlagDefinition =
  | { kind: "bands-horizontal"; colors: string[]; stops?: number[]; dot?: DotEmblem }
  | { kind: "bands-vertical"; colors: string[]; stops?: number[]; dot?: DotEmblem }
  | { kind: "cross"; background: string; cross: string; inner?: string }
  | { kind: "bespoke"; render: "uk" | "usa" | "turkey" | "australia" | "singapore" };

export const FLAGS: Record<string, FlagDefinition> = {
  uk: { kind: "bespoke", render: "uk" },
  usa: { kind: "bespoke", render: "usa" },
  turkey: { kind: "bespoke", render: "turkey" },
  australia: { kind: "bespoke", render: "australia" },
  singapore: { kind: "bespoke", render: "singapore" },

  france: { kind: "bands-vertical", colors: ["#0055A4", "#FFFFFF", "#EF4135"] },
  austria: { kind: "bands-horizontal", colors: ["#ED2939", "#FFFFFF", "#ED2939"] },
  egypt: {
    kind: "bands-horizontal",
    colors: ["#CE1126", "#FFFFFF", "#000000"],
    dot: { color: "#C09A2E", top: 50, left: 50, size: 0.3 },
  },
  japan: {
    kind: "bands-horizontal",
    colors: ["#FFFFFF"],
    dot: { color: "#BC002D", top: 50, left: 50, size: 0.34 },
  },
  china: {
    kind: "bands-horizontal",
    colors: ["#DE2910"],
    dot: { color: "#FFDE00", top: 32, left: 28, size: 0.28 },
  },
  ireland: { kind: "bands-vertical", colors: ["#169B62", "#FFFFFF", "#FF883E"] },
  germany: { kind: "bands-horizontal", colors: ["#000000", "#DD0000", "#FFCE00"] },
  italy: { kind: "bands-vertical", colors: ["#008C45", "#F4F5F0", "#CD212A"] },
  spain: {
    kind: "bands-horizontal",
    colors: ["#AA151B", "#F1BF00", "#AA151B"],
    stops: [0, 25, 75, 100],
  },
  portugal: {
    kind: "bands-vertical",
    colors: ["#046A38", "#DA291C"],
    stops: [0, 40, 100],
  },
  netherlands: { kind: "bands-horizontal", colors: ["#AE1C28", "#FFFFFF", "#21468B"] },
  belgium: { kind: "bands-vertical", colors: ["#000000", "#FDDA24", "#EF3340"] },
  poland: { kind: "bands-horizontal", colors: ["#FFFFFF", "#DC143C"] },
  czechia: { kind: "bands-horizontal", colors: ["#FFFFFF", "#D7141A"] },
  slovakia: { kind: "bands-horizontal", colors: ["#FFFFFF", "#0B4EA2", "#EE1C25"] },
  hungary: { kind: "bands-horizontal", colors: ["#CE2939", "#FFFFFF", "#477050"] },
  romania: { kind: "bands-vertical", colors: ["#002B7F", "#FCD116", "#CE1126"] },
  bulgaria: { kind: "bands-horizontal", colors: ["#FFFFFF", "#00966E", "#D62612"] },
  greece: { kind: "cross", background: "#0D5EAF", cross: "#FFFFFF" },
  croatia: { kind: "bands-horizontal", colors: ["#FF0000", "#FFFFFF", "#171796"] },
  slovenia: { kind: "bands-horizontal", colors: ["#FFFFFF", "#005CE6", "#ED1C24"] },
  serbia: { kind: "bands-horizontal", colors: ["#C6363C", "#0C4076", "#FFFFFF"] },
  bosnia: {
    kind: "bands-vertical",
    colors: ["#002395", "#FECB00"],
    stops: [0, 55, 100],
  },
  albania: { kind: "bands-horizontal", colors: ["#E41E20"] },
  northmacedonia: {
    kind: "bands-horizontal",
    colors: ["#D20000"],
    dot: { color: "#FFE600", top: 50, left: 50, size: 0.5 },
  },
  montenegro: { kind: "bands-horizontal", colors: ["#C40308"] },
  estonia: { kind: "bands-horizontal", colors: ["#0072CE", "#000000", "#FFFFFF"] },
  latvia: {
    kind: "bands-horizontal",
    colors: ["#9E3039", "#FFFFFF", "#9E3039"],
    stops: [0, 40, 60, 100],
  },
  lithuania: { kind: "bands-horizontal", colors: ["#FDB913", "#006A44", "#C1272D"] },
  ukraine: { kind: "bands-horizontal", colors: ["#0057B7", "#FFD700"] },
  belarus: {
    kind: "bands-horizontal",
    colors: ["#C8102E", "#00AF66"],
    stops: [0, 67, 100],
  },
  moldova: { kind: "bands-vertical", colors: ["#003DA5", "#FFD200", "#CC092F"] },
  luxembourg: { kind: "bands-horizontal", colors: ["#ED2939", "#FFFFFF", "#00A1DE"] },
  malta: { kind: "bands-vertical", colors: ["#FFFFFF", "#CF142B"] },
  cyprus: {
    kind: "bands-horizontal",
    colors: ["#FFFFFF"],
    dot: { color: "#D57800", top: 52, left: 50, size: 0.55 },
  },
  monaco: { kind: "bands-horizontal", colors: ["#CE1126", "#FFFFFF"] },
  sanmarino: { kind: "bands-horizontal", colors: ["#FFFFFF", "#5EB6E4"] },
  vatican: { kind: "bands-vertical", colors: ["#FFE000", "#FFFFFF"] },
  andorra: { kind: "bands-vertical", colors: ["#0018A8", "#FEDD00", "#D50032"] },
  liechtenstein: { kind: "bands-horizontal", colors: ["#002B7F", "#CE1126"] },

  denmark: { kind: "cross", background: "#C8102E", cross: "#FFFFFF" },
  sweden: { kind: "cross", background: "#006AA7", cross: "#FECC02" },
  norway: { kind: "cross", background: "#EF2B2D", cross: "#FFFFFF", inner: "#002868" },
  finland: { kind: "cross", background: "#FFFFFF", cross: "#003580" },
  iceland: { kind: "cross", background: "#02529C", cross: "#FFFFFF", inner: "#DC1E35" },
  switzerland: { kind: "cross", background: "#D52B1E", cross: "#FFFFFF" },
  georgia: { kind: "cross", background: "#FFFFFF", cross: "#FF0000" },

  russia: { kind: "bands-horizontal", colors: ["#FFFFFF", "#0039A6", "#D52B1E"] },
  armenia: { kind: "bands-horizontal", colors: ["#D90012", "#0033A0", "#F2A800"] },
  azerbaijan: { kind: "bands-horizontal", colors: ["#00B9E4", "#EF3340", "#509E2F"] },
  kazakhstan: {
    kind: "bands-horizontal",
    colors: ["#00AFCA"],
    dot: { color: "#FEC50C", top: 50, left: 50, size: 0.4 },
  },
  uzbekistan: { kind: "bands-horizontal", colors: ["#0099B5", "#FFFFFF", "#1EB53A"] },
  turkmenistan: {
    kind: "bands-vertical",
    colors: ["#00843D", "#D22730"],
    stops: [0, 88, 100],
  },
  kyrgyzstan: {
    kind: "bands-horizontal",
    colors: ["#E8112D"],
    dot: { color: "#FFD700", top: 50, left: 50, size: 0.45 },
  },
  tajikistan: { kind: "bands-horizontal", colors: ["#CC0000", "#FFFFFF", "#006600"] },
  iran: { kind: "bands-horizontal", colors: ["#239F40", "#FFFFFF", "#DA0000"] },
  iraq: { kind: "bands-horizontal", colors: ["#CE1126", "#FFFFFF", "#000000"] },
  syria: { kind: "bands-horizontal", colors: ["#CE1126", "#FFFFFF", "#000000"] },
  lebanon: {
    kind: "bands-horizontal",
    colors: ["#ED1C24", "#FFFFFF", "#ED1C24"],
    stops: [0, 25, 75, 100],
    dot: { color: "#00843D", top: 50, left: 50, size: 0.35 },
  },
  israel: {
    kind: "bands-horizontal",
    colors: ["#0038B8", "#FFFFFF", "#0038B8"],
    stops: [0, 20, 80, 100],
    dot: { color: "#0038B8", top: 50, left: 50, size: 0.4 },
  },
  jordan: { kind: "bands-horizontal", colors: ["#000000", "#FFFFFF", "#007A3D"] },
  saudiarabia: { kind: "bands-horizontal", colors: ["#006C35"] },
  yemen: { kind: "bands-horizontal", colors: ["#CE1126", "#FFFFFF", "#000000"] },
  oman: { kind: "bands-horizontal", colors: ["#FFFFFF", "#DB161B", "#008000"] },
  uae: { kind: "bands-horizontal", colors: ["#00732F", "#FFFFFF", "#000000"] },
  qatar: {
    kind: "bands-vertical",
    colors: ["#FFFFFF", "#8D1B3D"],
    stops: [0, 15, 100],
  },
  bahrain: {
    kind: "bands-vertical",
    colors: ["#FFFFFF", "#CE1126"],
    stops: [0, 30, 100],
  },
  kuwait: { kind: "bands-horizontal", colors: ["#007A3D", "#FFFFFF", "#CE1126"] },
  afghanistan: { kind: "bands-vertical", colors: ["#000000", "#D32011", "#007A36"] },
  pakistan: {
    kind: "bands-vertical",
    colors: ["#FFFFFF", "#01411C"],
    stops: [0, 25, 100],
  },
  india: {
    kind: "bands-horizontal",
    colors: ["#FF9933", "#FFFFFF", "#138808"],
    dot: { color: "#000080", top: 50, left: 50, size: 0.28 },
  },
  nepal: { kind: "bands-horizontal", colors: ["#DC143C"] },
  bhutan: { kind: "bands-horizontal", colors: ["#FFD520", "#FF4E12"] },
  bangladesh: {
    kind: "bands-horizontal",
    colors: ["#006A4E"],
    dot: { color: "#F42A41", top: 50, left: 44, size: 0.4 },
  },
  srilanka: { kind: "bands-vertical", colors: ["#00534E", "#FFAA00", "#8D153A"] },
  maldives: {
    kind: "bands-vertical",
    colors: ["#D21034", "#00843D", "#D21034"],
    stops: [0, 15, 85, 100],
  },
  mongolia: {
    kind: "bands-vertical",
    colors: ["#C4272F", "#015197", "#C4272F"],
    stops: [0, 25, 75, 100],
  },
  northkorea: {
    kind: "bands-horizontal",
    colors: ["#024FA2", "#ED1C27", "#024FA2"],
    stops: [0, 16, 84, 100],
    dot: { color: "#FFFFFF", top: 50, left: 26, size: 0.32 },
  },
  southkorea: {
    kind: "bands-horizontal",
    colors: ["#FFFFFF"],
    dot: { color: "#CD2E3A", top: 50, left: 50, size: 0.34 },
  },
  taiwan: {
    kind: "bands-horizontal",
    colors: ["#FE0000"],
    dot: { color: "#000095", top: 32, left: 28, size: 0.42 },
  },
  myanmar: {
    kind: "bands-horizontal",
    colors: ["#FECB00", "#34B233", "#EA2839"],
    dot: { color: "#FFFFFF", top: 50, left: 50, size: 0.3 },
  },
  thailand: {
    kind: "bands-horizontal",
    colors: ["#A51931", "#F4F5F8", "#2D2A4A", "#F4F5F8", "#A51931"],
    stops: [0, 18, 36, 64, 82, 100],
  },
  laos: {
    kind: "bands-horizontal",
    colors: ["#CE1126", "#002868", "#CE1126"],
    stops: [0, 25, 75, 100],
    dot: { color: "#FFFFFF", top: 50, left: 50, size: 0.34 },
  },
  cambodia: {
    kind: "bands-horizontal",
    colors: ["#032EA1", "#E00025", "#032EA1"],
    stops: [0, 25, 75, 100],
  },
  vietnam: {
    kind: "bands-horizontal",
    colors: ["#DA251D"],
    dot: { color: "#FFFF00", top: 50, left: 50, size: 0.4 },
  },
  malaysia: {
    kind: "bands-horizontal",
    colors: ["#CC0001", "#FFFFFF"],
    dot: { color: "#010066", top: 30, left: 28, size: 0.5 },
  },
  indonesia: { kind: "bands-horizontal", colors: ["#FF0000", "#FFFFFF"] },
  brunei: { kind: "bands-horizontal", colors: ["#FFCE00"] },
  philippines: { kind: "bands-horizontal", colors: ["#0038A8", "#CE1126"] },
  timorleste: { kind: "bands-horizontal", colors: ["#DC241F"] },
};

export type CountryCode = keyof typeof FLAGS;
