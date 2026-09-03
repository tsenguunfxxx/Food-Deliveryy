import dns from "node:dns";

import { serve } from "@hono/node-server";

// Зарим router/hotspot-ийн DNS relay нь SRV хүсэлтэд гажуудсан хариу буцаадаг тул
// mongodb+srv:// хаяг задрахгүй (EBADRESP). Локал дээр нийтийн resolver ашиглана.
const dnsServers = (process.env.DNS_SERVERS ?? "8.8.8.8,1.1.1.1")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const { default: app } = await import("./index.js");

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server ajillaj baina: http://localhost:${info.port}`);
});
