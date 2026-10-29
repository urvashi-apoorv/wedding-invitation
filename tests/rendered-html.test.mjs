import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the active wedding invitation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Wedding Invitation/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /https:\/\/urvashi-apoorv\.github\.io\/wedding-invitation\/og-v4\.jpg/);
  assert.match(html, /property="og:image:type" content="image\/jpeg"/);
  assert.match(html, /rel="image_src"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /class="film-site"/);
  assert.match(html, /With Love &amp; Blessings/i);
  assert.match(html, /Wedding Location/i);
  assert.match(html, /Join the Wedding Group/i);
  assert.match(html, /https:\/\/chat\.whatsapp\.com\/DRyONMADTcXEgmmJXeam6u/);
  assert.match(html, /Click to open/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps personalisation in one configuration file", async () => {
  const config = await readFile(new URL("../app/wedding.config.ts", import.meta.url), "utf8");
  assert.match(config, /PERSONALISE YOUR INVITATION HERE/);
  assert.match(config, /PAGE-BY-PAGE CONTENT/);
  assert.match(config, /PAGE 1 — CLOSED ENVELOPE/);
  assert.match(config, /PAGE 7 — WHATSAPP GROUP INVITE/);
  assert.match(config, /pages:/);
  assert.match(config, /blessingLine:/);
  assert.match(config, /familyLine:/);
  assert.match(config, /public\/music\/wedding-song\.mp3/);
  assert.match(config, /mapEmbedUrl/);
  assert.match(config, /events:/);
  assert.match(config, /branding:/);
  assert.match(config, /presentation:/);
  assert.match(config, /photos:/);
  assert.match(config, /music:/);
  assert.match(config, /WEBSITE ADDRESS AND WHATSAPP \/ SOCIAL LINK PREVIEW/);
  assert.match(config, /socialPreviewImage:/);

  const entryPoint = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(entryPoint, /AamantranWeddingInvitation/);
  assert.doesNotMatch(entryPoint, /\.\/WeddingInvitation|activeTemplate|royal/i);
});
