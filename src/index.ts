import "dotenv/config";

const { getRecentEvents } = require("./stellar/events");
const { normalizeEvent } = require("./stellar/normalizer");
import process = require("process");

async function main() {
  console.log("Stellar Sentinel");
  console.log("================");

  console.log("\nFetching recent contract events...");

  const result = await getRecentEvents();

  console.log(`Events found: ${result.events.length}`);

  for (const event of result.events) {
    const decoded = normalizeEvent(event);

    console.log("\n--- Normalized Event ---");

    console.log(
      JSON.stringify(
        decoded,
        (_, value) =>
          typeof value === "bigint"
            ? value.toString()
            : value,
        2
      )
    );
  }
}

main().catch((error) => {
  console.error("Failed to start Stellar Sentinel:");
  console.error(error);
  process.exit(1);
});