import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const need = (n) => {
  const v = process.env[n];
  if (!v) { console.error("Missing env var: " + n); process.exit(1); }
  return v;
};

const cfg = {
  SUPABASE_URL: need("SUPABASE_URL"),
  SUPABASE_BUCKET: need("SUPABASE_BUCKET"),
  SUPABASE_ANON_KEY: need("SUPABASE_ANON_KEY"),
  FILES: { ENGLISH: "data.json", PRACTICE: "study.json" },
  AUTO_SYNC: true,
  AUTO_SYNC_DELAY: 300000
};

const inline =
  "<script>window.APP_CONFIG=" +
  JSON.stringify(cfg).replace(/</g, "\\u003c") +
  ";</script>";
const tag = /<script src="(?:\.\.\/)?config\.js"><\/script>/;

for (const f of ["index.html", "eng/index.html", "par/index.html"]) {
  let html = readFileSync(f, "utf8");
  if (tag.test(html)) html = html.replace(tag, () => inline);
  if (!html.includes('name="robots"')) {
    html = html.replace("<head>", '<head><meta name="robots" content="noindex,nofollow">');
  }
  const out = join("build", f);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log("built", out);
}