// Regenerates lib/screens/*.ts from the original Claude Design export.
// Run from the frontend dir: `npm run gen:design`
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(
  __dirname,
  "../../_design_src/postwing-landing-page/project/Postwing.dc.html"
);
const OUT = resolve(__dirname, "../lib/screens");
mkdirSync(OUT, { recursive: true });

const html = readFileSync(SRC, "utf8");

function slice(startMarker, endMarker) {
  const s = html.indexOf(startMarker);
  const e = html.indexOf(endMarker, s + startMarker.length);
  if (s < 0 || e < 0) throw new Error("marker not found: " + startMarker);
  return html.slice(s + startMarker.length, e);
}

let landing = slice(
  "<!-- ============================== LANDING ============================== -->",
  "<!-- ============================== LOGIN ============================== -->"
);
let login = slice(
  "<!-- ============================== LOGIN ============================== -->",
  "<!-- ============================== REGISTER ============================== -->"
);
let register = slice(
  "<!-- ============================== REGISTER ============================== -->",
  "<!-- ============================== COMING SOON ============================== -->"
);
let soon = slice(
  "<!-- ============================== COMING SOON ============================== -->",
  "\n</div>\n</x-dc>"
);

function stripOuterScIf(s) {
  s = s.replace(/^\s*<sc-if value="\{\{ is\w+ \}\}"[^>]*>\s*/, "");
  s = s.replace(/\s*<\/sc-if>\s*$/, "");
  return s.trim();
}

function common(s) {
  s = s.replace(/onClick="\{\{ goLanding \}\}"/g, 'data-pw-nav="landing"');
  s = s.replace(/onClick="\{\{ goLogin \}\}"/g, 'data-pw-nav="login"');
  s = s.replace(/onClick="\{\{ goRegister \}\}"/g, 'data-pw-nav="register"');
  s = s.replace(/onClick="\{\{ goSoon \}\}"/g, 'data-pw-nav="soon"');
  s = s.replace(/onSubmit="\{\{ submitAuth \}\}"/g, 'data-pw-form="login"');
  s = s.replace(/onSubmit="\{\{ submitRegister \}\}"/g, 'data-pw-form="register"');
  s = s.replace(/\s*style-focus="[^"]*"/g, "");
  return s;
}

landing = stripOuterScIf(landing);
login = stripOuterScIf(login);
register = stripOuterScIf(register);
soon = stripOuterScIf(soon);

// Remove the Pricing section entirely (plus its now-dead nav/footer links).
landing = landing.replace(/\s*<section id="pricing"[\s\S]*?<\/section>/, "");
landing = landing.replace(/\s*<a href="#pricing"[^>]*>Pricing<\/a>/g, "");

// Landing pricing toggle: default to ANNUAL.
landing = landing.replace(/<sc-if value="\{\{ isMonthly \}\}"[^>]*>[\s\S]*?<\/sc-if>/g, "");
landing = landing.replace(/<sc-if value="\{\{ isAnnual \}\}"[^>]*>/g, "");
landing = landing.replace(/<\/sc-if>/g, "");
landing = landing.replace(/onClick="\{\{ setMonthly \}\}"/g, 'data-pw-bill="monthly"');
landing = landing.replace(/onClick="\{\{ setAnnual \}\}"/g, 'data-pw-bill="annual"');
landing = landing.replace(/\/mo billed yearly/g, '<span class="pw-bill-suffix">/mo billed yearly</span>');

landing = common(landing);
login = common(login);
register = common(register);
soon = common(soon);

const GOOGLE_BTN_OPEN =
  '<button style="display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;border:1px solid #E7E4DB;padding:13px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;font-family:inherit;color:#14130F;">';
const GOOGLE_BTN_TAGGED = GOOGLE_BTN_OPEN.replace("<button ", '<button type="button" data-pw-google="1" ');
login = login.split(GOOGLE_BTN_OPEN).join(GOOGLE_BTN_TAGGED);
register = register.split(GOOGLE_BTN_OPEN).join(GOOGLE_BTN_TAGGED);

for (const [name, frag] of Object.entries({ landing, login, register, soon })) {
  if (/sc-if|\{\{|onClick=|onSubmit=|style-focus/.test(frag)) {
    const m = frag.match(/sc-if|\{\{[^}]*\}\}|onClick=|onSubmit=|style-focus/);
    throw new Error(`Leftover framework artifact in ${name}: ${m && m[0]}`);
  }
}

const toModule = (name, frag) =>
  `// AUTO-GENERATED from Postwing.dc.html by scripts/transform.mjs — do not edit by hand.\nexport const ${name}Html = ${JSON.stringify(frag)};\n`;

writeFileSync(`${OUT}/landing.ts`, toModule("landing", landing));
writeFileSync(`${OUT}/login.ts`, toModule("login", login));
writeFileSync(`${OUT}/register.ts`, toModule("register", register));
writeFileSync(`${OUT}/soon.ts`, toModule("soon", soon));

console.log("Generated screens:", {
  landing: landing.length,
  login: login.length,
  register: register.length,
  soon: soon.length,
});
