require("dotenv/config");

const { getLatestLedger } = require("./stellar/latest-ledger");
const { getEventsBetween } = require("./stellar/events");
const { normalizeEvent } = require("./stellar/normalizer");
const { saveEvent } = require("./database/events");
const {
  getLastProcessedLedger,
  updateLastProcessedLedger,
} = require("./database/indexer-state");
const { testDatabaseConnection } = require("./database/db");

const NETWORK = "stellar-testnet";

async function main() {
  console.log("Stellar Sentinel");
  console.log("================");

  // Test database connection
  const database = await testDatabaseConnection();

  console.log("PostgreSQL connected");
  console.log(`Database time: ${database.current_time}`);

  // Get latest Stellar ledger
  const latestLedger = await getLatestLedger();

  console.log(`Latest ledger: ${latestLedger}`);

  // Get our checkpoint
  const lastProcessedLedger =
    await getLastProcessedLedger(NETWORK);

  let startLedger: number;

  if (lastProcessedLedger === null) {
    // First run
    startLedger = Math.max(1, latestLedger - 100);

    console.log(
      `No checkpoint found. Starting from ledger ${startLedger}`
    );
  } else {
    // Continue from where we stopped
    startLedger = lastProcessedLedger + 1;

    console.log(
      `Checkpoint found: ${lastProcessedLedger}`
    );
  }

  // Nothing new to process
  if (startLedger > latestLedger) {
    console.log("No new ledgers to process.");
    return;
  }

  console.log(
    `Processing ledgers ${startLedger} → ${latestLedger}`
  );

  // Fetch events
  const result = await getEventsBetween(
    startLedger,
    latestLedger
  );

  console.log(`Events found: ${result.events.length}`);

  let saved = 0;

  // Normalize and save events
  for (const event of result.events) {
    const normalized = normalizeEvent(event);

    await saveEvent(normalized);

    saved++;
  }

  // Only update checkpoint after successful processing
  await updateLastProcessedLedger(
    NETWORK,
    latestLedger
  );

  console.log(`Events processed: ${saved}`);
  console.log(
    `Checkpoint updated to ledger ${latestLedger}`
  );
}

main().catch((error) => {
  console.error("Failed to start Stellar Sentinel:");
  console.error(error);
  process.exit(1);
});