const { PrismaClient } = require("@prisma/client");
const http = require("http");

const prisma = new PrismaClient();

async function run() {
  try {
    // Find a flight that has a valid slug and ID
    const flight = await prisma.flight.findFirst({
      where: {
        slug: { not: null },
      },
      select: { id: true, slug: true },
    });

    if (!flight) {
      console.log("No flights with slugs found in the database.");
      return;
    }

    console.log(`Testing flight: ID="${flight.id}", slug="${flight.slug}"`);

    // Make an HTTP request to the local dev server on port 3000
    // Under terrific-travel tenant or default path /v/[id]
    // Note: Next.js middleware rewrites the host, but we can send host header: terrifictravel.co.uk
    const options = {
      hostname: "localhost",
      port: 3000,
      path: `/v/${flight.id}`,
      method: "GET",
      headers: {
        "Host": "terrifictravel.co.uk",
      },
    };

    const req = http.request(options, (res) => {
      console.log(`Response Status Code: ${res.statusCode}`);
      console.log("Response Headers:");
      console.log(res.headers);
    });

    req.on("error", (e) => {
      console.error(`Request failed: ${e.message}`);
    });

    req.end();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
