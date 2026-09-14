import { db } from "./db";

export async function saveEvent(event: {
  id: string;
  contractId: string;
  txHash: string;
  ledger: number;
  eventName: string;
  type: string;
  topics: unknown[];
  value: unknown;
}) {
  await db.query(
    `
    INSERT INTO events (
      id,
      contract_id,
      transaction_hash,
      ledger,
      event_name,
      event_type,
      topics,
      value
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO NOTHING
    `,
    [
      event.id,
      event.contractId,
      event.txHash,
      event.ledger,
      event.eventName,
      event.type,
      JSON.stringify(event.topics, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
      JSON.stringify(event.value, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
    ]
  );
}