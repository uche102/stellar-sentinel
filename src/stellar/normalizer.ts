import { decodeEvent } from "./decoder";

export function normalizeEvent(event: {
  id: string;
  contractId: string;
  ledger: number;
  txHash: string;
  topic: unknown[];
  value: unknown;
}) {
  const decoded = decodeEvent(event);

  const { eventName, topics, value } = decoded;

  switch (eventName) {
    case "transfer":
      return {
        ...decoded,
        type: "transfer",

        from: topics[1],
        to: topics[2],
        asset: topics[3],
        amount: value,
      };

    case "fee":
      return {
        ...decoded,
        type: "fee",

        account: topics[1],
        amount: value,
      };

    case "approve":
      return {
        ...decoded,
        type: "approve",

        from: topics[1],
        spender: topics[2],
        amount: Array.isArray(value) ? value[0] : value,
        expirationLedger: Array.isArray(value)
          ? value[1]
          : undefined,
      };

    default:
      return {
        ...decoded,
        type: "unknown",
      };
  }
}