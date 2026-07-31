const fs = require("fs");
const path = require("path");
const { GoogleAdsApi } = require("google-ads-api");

// Load .env values
const envContent = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}\\s*=\\s*["']?([^"'\r\n]+)["']?`));
  return match ? match[1].trim() : null;
};

const developerToken = getEnvVar("GOOGLE_ADS_DEVELOPER_TOKEN");
const customerId = (getEnvVar("GOOGLE_ADS_CUSTOMER_ID") || "").replace(/[^0-9]/g, "");
const client_id = getEnvVar("GOOGLE_ADS_CLIENT_ID");
const client_secret = getEnvVar("GOOGLE_ADS_CLIENT_SECRET");
const refresh_token = getEnvVar("GOOGLE_ADS_REFRESH_TOKEN");

console.log("Loaded credentials:");
console.log({ developerToken, customerId, client_id, client_secret, refresh_token: refresh_token ? "SET" : "MISSING" });

const client = new GoogleAdsApi({
  client_id,
  client_secret,
  developer_token: developerToken,
});

const customer = client.Customer({
  customer_id: "2943689021",
  login_customer_id: "1886283319",
  refresh_token,
});

async function run() {
  try {
    console.log("Calling generateKeywordIdeas...");
    const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
      customer_id: "2943689021",
      keywordSeed: { keywords: ["umrah packages"] },
      geoTargetConstants: ["geoTargetConstants/2826"],
      keywordPlanNetwork: "GOOGLE_SEARCH",
      language: "languageConstants/1000",
    });
    console.log("Success! Response:", response);
  } catch (error) {
    console.error("API Call Failed!");
    console.error("Error Object:", JSON.stringify(error, null, 2));
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
  }
}

run();
