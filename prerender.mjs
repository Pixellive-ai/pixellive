// Post-build prerender for the homepage. The app is a Vite SPA (createRoot), so the
// shipped index.html has an empty <div id="root">, which means crawlers + AI engines +
// social scrapers that don't run JS see no <h1> and almost no text. This injects a
// real, semantic, crawler-visible version of the homepage's key content INTO #root.
// On the client, React's createRoot wipes #root and renders the full app over it — so
// users get the normal experience, and bots get a fully-described page. (Content mirrors
// what the app renders — not cloaking. Doubles as an instant-LCP paint.)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(dir, "dist", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

// 1) Trim the meta description to ≤160 chars (Google truncates ~155–160).
const META = "We run your entire online presence so you don't have to think about it — AI automation, lead gen, web & app dev, SEO, paid ads, social & video.";
html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/i, `$1${META}$2`);

const SERVICES = [
  ["ai-automation", "AI Automation & Lead Generation", "AI systems that bring you customers — leads, content, and reporting handled end-to-end."],
  ["ai-web-development", "AI Web Development", "Websites and apps with AI built in — chat, search, personalization."],
  ["seo", "SEO", "Data-driven organic search growth, built for the AI-search era."],
  ["paid-ads", "SEM & Paid Ads", "High-ROI paid campaigns across Google, Meta & beyond."],
  ["social-media", "Social Media", "Always-on content, posting, and engagement across your channels."],
  ["web-app-development", "Web & App Development", "Fast, conversion-focused websites and apps, built to scale."],
  ["content-planning", "Content Planning", "Editorial calendars and content systems that build brand authority."],
  ["video-production", "Video Production", "Commercial-grade video and cinematography that converts."],
];

// FAQ — answers in a form AI answer engines extract + cite (FAQPage schema below).
const FAQ = [
  ["What does Pixellive Production do?", "Pixellive Production is an AI-powered digital agency and production house. We run your entire online presence — AI automation and lead generation, web and app development, SEO, paid ads, social media management, and video production — done-for-you."],
  ["Does Pixellive Production do AI automation?", "Yes. AI automation and lead generation is our lead service. We build and run AI systems that bring you customers — leads, content, and reporting handled end-to-end, on an automation layer we run for you."],
  ["What digital marketing services does Pixellive offer?", "AI automation and lead generation, AI web development, SEO, SEM and paid ads, social media management, web and app development, content planning, and video production."],
  ["Does Pixellive do SEO and paid ads?", "Yes. We handle data-driven SEO optimised for the AI-search era, plus high-ROI paid ad campaigns across Google, Meta, and more — managed and reported for you."],
  ["Where is Pixellive Production based?", "Pixellive Production is based in India and serves clients worldwide. Our digital and AI-automation services run remotely; our video production is rooted in India."],
  ["How do I get started with Pixellive?", "Reach out via the contact page or email hello@pixelliveproduction.com. We learn your goals, build your online-presence system, then run and improve it for you."],
];
const HOWTO_STEPS = [
  ["Reach out", "Tell us your goals and where you want to grow."],
  ["We build your system", "We design and build your AI-powered online presence — site, content, ads, automation."],
  ["We run and improve it", "We operate and optimise it for you, reporting results monthly."],
];
const TODAY = new Date().toISOString().slice(0, 10);

// 2) Build the static, crawler-visible homepage content.
const prerendered = `
      <div id="prerender-seo" style="min-height:100vh;background:#050508;color:#fff;font-family:Inter,system-ui,sans-serif;padding:32px 20px;text-align:center">
        <header>
          <nav aria-label="Primary" style="display:flex;gap:20px;justify-content:center;font-size:14px;color:#9aa">
            <a href="/" style="color:#fff">Home</a>
            <a href="/about" style="color:#9aa">About</a>
            <a href="/services" style="color:#9aa">Services</a>
            <a href="/contact" style="color:#9aa">Contact</a>
          </nav>
        </header>
        <main style="max-width:880px;margin:64px auto 0">
          <p style="text-transform:uppercase;letter-spacing:.2em;font-size:12px;color:#00F0FF">AI-Powered Digital Agency</p>
          <h1 style="font-size:clamp(36px,7vw,64px);font-weight:800;line-height:1.05;margin:16px 0">We Build Worlds. You Conquer Them.</h1>
          <p style="font-size:18px;color:#c7c7d1;max-width:60ch;margin:0 auto">We handle your entire online presence — leads, content, ads, and automation — so you don't have to think about it. AI-powered, done-for-you. Pixellive Production is a digital agency and production house.</p>
          <div style="margin-top:28px">
            <a href="/services" style="background:#EC1C24;color:#fff;padding:12px 24px;border-radius:12px;font-weight:600;text-decoration:none">View Our Work</a>
            <a href="/contact" style="color:#fff;padding:12px 24px;text-decoration:none">Talk to Us</a>
          </div>
          <section style="margin-top:64px;text-align:left">
            <h2 style="font-size:28px;font-weight:700;text-align:center;margin-bottom:24px">What We Do</h2>
            <ul style="list-style:none;padding:0;display:grid;gap:14px">
              ${SERVICES.map(([slug, title, desc]) => `<li><h3 style="font-size:18px;margin:0 0 4px"><a href="/services/${slug}" style="color:#fff">${title}</a></h3><p style="color:#9aa;margin:0">${desc}</p></li>`).join("\n              ")}
            </ul>
          </section>
          <section style="margin-top:64px;text-align:left">
            <h2 style="font-size:28px;font-weight:700;text-align:center;margin-bottom:24px">Frequently Asked Questions</h2>
            ${FAQ.map(([q, a]) => `<div style="margin-bottom:18px"><h3 style="font-size:17px;margin:0 0 4px">${q}</h3><p style="color:#9aa;margin:0">${a}</p></div>`).join("\n            ")}
          </section>
          <p style="margin-top:40px;color:#555;font-size:12px">Last updated <time datetime="${TODAY}">${TODAY}</time></p>
        </main>
        <footer style="margin-top:64px;color:#777;font-size:13px">
          <p>Pixellive Production — AI automation &amp; digital agency. Web development, SEO, paid ads, social media, and video production.</p>
          <p><a href="mailto:hello@pixelliveproduction.com" style="color:#9aa">hello@pixelliveproduction.com</a></p>
        </footer>
      </div>`;

if (!html.includes('<div id="root"></div>')) {
  console.error("prerender: <div id=\"root\"></div> not found — did the build change?");
  process.exit(1);
}
html = html.replace('<div id="root"></div>', `<div id="root">${prerendered}\n    </div>`);

// 3) Structured data for AI answer engines: FAQPage + HowTo (+ freshness via dateModified).
const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage", "dateModified": TODAY,
  "mainEntity": FAQ.map(([q, a]) => ({ "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a } })),
};
const howToLd = {
  "@context": "https://schema.org", "@type": "HowTo", "name": "How to get started with Pixellive Production", "dateModified": TODAY,
  "step": HOWTO_STEPS.map(([name, text], i) => ({ "@type": "HowToStep", "position": i + 1, "name": name, "text": text })),
};
const ld = `\n    <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n    <script type="application/ld+json">${JSON.stringify(howToLd)}</script>\n  </head>`;
html = html.replace("</head>", ld);

fs.writeFileSync(htmlPath, html);
console.log(`✅ prerendered homepage into dist/index.html (+${prerendered.length} bytes of crawlable content, h1 + ${SERVICES.length} service links, meta trimmed to ${META.length} chars)`);
