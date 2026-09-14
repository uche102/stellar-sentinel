import { stellarRpc } from "./rpc";

export async function getLatestLedger(): Promise<number> {
  const result = await stellarRpc.getLatestLedger();

  return result.sequence;
}
