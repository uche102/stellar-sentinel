import { db } from "./db";

export async function getLastProcessedLedger(
  network: string
): Promise<number | null> {
  const result = await db.query(
    `
    SELECT last_processed_ledger
    FROM indexer_state
    WHERE network = $1
    `,
    [network]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return Number(result.rows[0].last_processed_ledger);
}

export async function updateLastProcessedLedger(
  network: string,
  ledger: number
): Promise<void> {
  await db.query(
    `
    INSERT INTO indexer_state (
      network,
      last_processed_ledger,
      updated_at
    )
    VALUES ($1, $2, NOW())
    ON CONFLICT (network)
    DO UPDATE SET
      last_processed_ledger = EXCLUDED.last_processed_ledger,
      updated_at = NOW()
    `,
    [network, ledger]
  );
}
