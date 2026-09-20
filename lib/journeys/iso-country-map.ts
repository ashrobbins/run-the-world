/**
 * Maps ISO 3166-1 alpha-2 country codes (what Mapbox's geocoder returns) to the
 * internal keys used by components/checkpoint-marker/flags.ts. Countries we don't
 * have a flag for simply aren't in this map — CheckpointMarker already falls back
 * gracefully (to the UK flag) for an unknown code.
 */
export const ISO_TO_FLAG_CODE: Record<string, string> = {
  gb: "uk", ie: "ireland", fr: "france", de: "germany", it: "italy", es: "spain",
  pt: "portugal", nl: "netherlands", be: "belgium", pl: "poland", cz: "czechia",
  sk: "slovakia", hu: "hungary", ro: "romania", bg: "bulgaria", gr: "greece",
  hr: "croatia", si: "slovenia", rs: "serbia", ba: "bosnia", al: "albania",
  mk: "northmacedonia", me: "montenegro", ee: "estonia", lv: "latvia", lt: "lithuania",
  ua: "ukraine", by: "belarus", md: "moldova", lu: "luxembourg", mt: "malta",
  cy: "cyprus", mc: "monaco", sm: "sanmarino", va: "vatican", ad: "andorra",
  li: "liechtenstein", dk: "denmark", se: "sweden", no: "norway", fi: "finland",
  is: "iceland", ch: "switzerland", at: "austria", ge: "georgia", ru: "russia",
  tr: "turkey", am: "armenia", az: "azerbaijan", ir: "iran", iq: "iraq", sy: "syria",
  lb: "lebanon", il: "israel", jo: "jordan", sa: "saudiarabia", ye: "yemen",
  om: "oman", ae: "uae", qa: "qatar", bh: "bahrain", kw: "kuwait", kz: "kazakhstan",
  uz: "uzbekistan", tm: "turkmenistan", kg: "kyrgyzstan", tj: "tajikistan",
  af: "afghanistan", pk: "pakistan", in: "india", np: "nepal", bt: "bhutan",
  bd: "bangladesh", lk: "srilanka", mv: "maldives", cn: "china", mn: "mongolia",
  kp: "northkorea", kr: "southkorea", tw: "taiwan", jp: "japan", mm: "myanmar",
  th: "thailand", la: "laos", kh: "cambodia", vn: "vietnam", my: "malaysia",
  sg: "singapore", id: "indonesia", bn: "brunei", ph: "philippines", tl: "timorleste",
  us: "usa", ca: "canada", mx: "mexico", gt: "guatemala", bz: "belize",
  hn: "honduras", sv: "elsalvador", ni: "nicaragua", cr: "costarica", pa: "panama",
  cu: "cuba", jm: "jamaica", ht: "haiti", do: "dominicanrepublic", bs: "bahamas",
  tt: "trinidadandtobago", pr: "puertorico", co: "colombia", ve: "venezuela",
  gy: "guyana", sr: "suriname", ec: "ecuador", pe: "peru", br: "brazil",
  bo: "bolivia", py: "paraguay", cl: "chile", ar: "argentina", uy: "uruguay",
  au: "australia",
};
