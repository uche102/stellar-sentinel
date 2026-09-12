import { stellarRpc } from "./rpc";

export async function getRecentEvents() {
  const latestLedger = await stellarRpc.getLatestLedger();

  const startLedger = latestLedger.sequence - 100;

  const result = await stellarRpc.getEvents({
    startLedger,
    filters: [
      {
        type: "contract",
      },
    ],
    pagination: {
      limit: 10,
    },
  });

  return result;
}