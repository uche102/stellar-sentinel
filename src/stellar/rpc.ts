import { Server } from "@stellar/stellar-sdk/rpc";
import process = require("process");

const RPC_URL =
  process.env.STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";

export const stellarRpc = new Server(RPC_URL);