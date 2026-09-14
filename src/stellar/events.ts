import { stellarRpc } from "./rpc";

export async function getEventsBetween(
  startLedger: number,
  endLedger: number
) {
  const allEvents = [];

  let cursor: string | undefined;

  while (true) {
    const request: any = {
      filters: [
        {
          type: "contract",
        },
      ],
      limit: 100,
    };

    if (cursor) {
      request.cursor = cursor;
    } else {
      request.startLedger = startLedger;
      request.endLedger = endLedger;
    }

    const result = await stellarRpc.getEvents(request);

    allEvents.push(...result.events);

    console.log(
      `Fetched ${result.events.length} events (total: ${allEvents.length})`
    );

    if (!result.cursor || result.events.length === 0) {
      break;
    }

    cursor = result.cursor;
  }

  return {
    events: allEvents,
  };
}