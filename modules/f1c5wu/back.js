/* belediye-e-hizmet-dizini — Belediye e-Hizmet Dizini — A–Z harf çubuğu, canlı arama, başvuru türü rozetli hizmet satırları (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Üstte yapışkan arama kutusu ve «n / t» sayacı, altında hizmet adlarının ilk harflerinden türeyen A–Z harf çubuğu (sayfa dilinin alfabe sırası, `Intl.Collator`). Hizmetler harf başlıklı gruplar hâlinde: ikon, ad (bağlantı), birim, açıklama, başvuru türü rozeti (çevrim içi / yüz yüze), gerekli belge sayısı, sonuçlanma süresi. Arama aksan ve büyük/küçük harf duyarsızdır; boşalan harfler çubukta soluklaşır. Kayıt alanları: `birim` · `online` (true/false) · `belge` · `sure`. JS yokken arama gizli, harf çubuğu bağlantı olarak çalışır.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-belediye-e-hizmet-dizini";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: belediye-e-hizmet-dizini --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    let kol;
    try { kol = new Intl.Collator(dil || undefined, { sensitivity: "base" }); } catch (e) { kol = { compare: (a, b) => (a < b ? -1 : a > b ? 1 : 0) }; }
    const ust = (t) => { try { return t.toLocaleUpperCase(dil || undefined); } catch (e) { return t.toUpperCase(); } };
    const OA = metinAl(des, ["onlineAd"]);
    const YA = metinAl(des, ["yuzyuzeAd"]);
    const BA = metinAl(des, ["belgeAd"]);
    const AA = metinAl(des, ["aramaAd"]);
    const H = A.map((k, i) => {
      const ov = R[i] ? ilk(R[i], ["online", "eDevlet"]) : "";
      const be = Number(x(i, ["belge", "evrak"]));
      return { k, i, harf: ust(Array.from(k.baslik.trim())[0] || "#"), birim: x(i, ["birim", "department"]), on: ov === "" ? null : dogru(ov, false), belge: x(i, ["belge", "evrak"]) !== "" && Number.isFinite(be) ? be : NaN, sure: x(i, ["sure", "duration"]) };
    }).sort((a, b) => kol.compare(a.k.baslik, b.k.baslik));
    const G = [];
    H.forEach((h) => { let g = G.find((z) => kol.compare(z.harf, h.harf) === 0); if (!g) { g = { harf: h.harf, L: [] }; G.push(g); } g.L.push(h); });
    const gid = (j) => `${P}-{{id}}-h${j}`;
    const satir = (h) => `<li class="${P}-hiz" data-ara="${esc([h.k.baslik, h.birim, h.k.metin].join(" "))}">${ikonH(h.k.ikon || "description", `${P}-hik`)}<div class="${P}-hyazi"><h4 class="${P}-had">${h.k.url ? `<a class="${P}-hbag" href="${esc(h.k.url)}">${esc(h.k.baslik)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : esc(h.k.baslik)}</h4>${h.birim ? `<p class="${P}-hbirim">${esc(h.birim)}</p>` : ""}${h.k.metin ? `<p class="${P}-hacik">${satirlar(h.k.metin)}</p>` : ""}</div><ul class="${P}-hrozet" role="list">${h.on !== null && (h.on ? OA : YA) ? `<li class="${P}-tur ${P}-tur--${h.on ? "on" : "yy"}">${ikonH(h.on ? "language" : "how_to_reg", "")}${esc(h.on ? OA : YA)}</li>` : ""}${Number.isFinite(h.belge) && h.belge > 0 ? `<li>${ikonH("folder_open", "")}<bdi>${sayiBicim(h.belge, 0)}</bdi>${BA ? ` ${esc(BA)}` : ""}</li>` : ""}${h.sure ? `<li>${ikonH("schedule", "")}${esc(h.sure)}</li>` : ""}</ul></li>`;
    const harfler = G.length > 1 ? `<nav class="${P}-harfler" aria-label="${esc(metinAl(des, ["harfAd"]) || B.baslik)}">${G.map((g, j) => `<a class="${P}-harf" href="#${gid(j)}" data-harf="${j}">${esc(g.harf)}</a>`).join("")}</nav>` : "";
    const arama = `<div class="${P}-arama" data-akap hidden><label class="${P}-akutu">${ikonH("search", `${P}-aik`)}<span class="${P}-gizli">${esc(AA || B.baslik)}</span><input class="${P}-agirdi" type="search" data-ara-gir placeholder="${esc(AA)}" autocomplete="off" /></label><output class="${P}-asay" data-asay aria-live="polite"></output></div>`;
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div><div class="${P}-dizin">${arama}${harfler}<div class="${P}-gruplar">${G.map((g, j) => `<div class="${P}-grup" id="${gid(j)}" data-grup="${j}"><h3 class="${P}-gharf" aria-hidden="true">${esc(g.harf)}</h3><ul class="${P}-hizmetler" role="list">${g.L.map(satir).join("")}</ul></div>`).join("")}<p class="${P}-ayok" data-ayok hidden>@no-results@</p></div></div>${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
