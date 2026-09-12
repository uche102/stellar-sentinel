import stellarSdk = require("@stellar/stellar-sdk");

const { scValToNative, xdr, StrKey } = stellarSdk;

function decodeScVal(value: unknown): unknown {
  // The SDK may already return an ScVal object.
  if (typeof value === "object" && value !== null) {
    try {
      return scValToNative(value as xdr.ScVal);
    } catch {
      return value;
    }
  }

  // Handle base64 encoded XDR.
  if (typeof value === "string") {
    const scVal = xdr.ScVal.fromXDR(value, "base64");
    return scValToNative(scVal);
  }

  return value;
}

function normalizeContractId(contractId: unknown): string {
  if (typeof contractId === "string") {
    return contractId;
  }

  if (
    typeof contractId === "object" &&
    contractId !== null
  ) {
    const raw = contractId as {
      _id?: Record<string, number>;
    };

    if (raw._id) {
      const bytes = Uint8Array.from(
        Object.keys(raw._id)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => raw._id![key])
      );

      return StrKey.encodeContract(bytes);
    }
  }

  return String(contractId);
}

function decodeEvent(event: {
  id: string;
  contractId: unknown;
  ledger: number;
  txHash: string;
  topic: unknown[];
  value: unknown;
}) {
  const decodedTopics = event.topic.map((topic) =>
    decodeScVal(topic)
  );

  const eventName =
    typeof decodedTopics[0] === "string"
      ? decodedTopics[0]
      : "unknown";

  const decodedValue = decodeScVal(event.value);

  return {
    id: event.id,
    contractId: normalizeContractId(event.contractId),
    ledger: event.ledger,
    txHash: event.txHash,
    eventName,
    topics: decodedTopics,
    value: decodedValue,
  };
}

module.exports = { decodeScVal, decodeEvent };