// WebSocketService.ts
import tickersRawRatingOrder from "@/assets/coinInfo/tickers_rating_order.json";

interface CoinData {
  code: string;
  L52: number; 
  H52: number; 
  highest_52_week_price:number;
  trade_price:number;
  lowest_52_week_price:number
}

class WebSocketService {
  ws: WebSocket | null = null;
  updateFunctions: ((data: any) => void)[] = [];
  dataDictionary: { [key: string]: any } = {};
  coinsData: { [key: string]: CoinData } = {};
  tickersRaw = tickersRawRatingOrder;

  constructor(updateFunction?: (data: any) => void) {
    if (updateFunction) {
      this.updateFunctions.push(updateFunction);
    }
  }

  registerUpdateFunction(updateFunction: (data: any) => void) {
    this.updateFunctions.push(updateFunction);
  }

async handleWebSocketMessageIn(payload: MessageEvent) {
  try {
    const text = await payload.data.text();
    const data = JSON.parse(text);

    // Add a check for the expected structure before triggering update functions
    if (data && typeof data === 'object') {
      // Trigger update functions
      this.updateFunctions.forEach((fn) => fn(this.dataSettings(data)));
    } else {
      console.error('Invalid data structure:', data);
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
}
 dataSettings = (data: {
  code: string; // Make sure 'code' is of type string if that's the intended type

  highest_52_week_price: number;
  trade_price: number;
  lowest_52_week_price: number;
  L52: number;
  H52: number;
  DP52: number;
}) => {
  const code = data.code;

  if (this.tickersRaw.includes(code)) {
    const referencePrice1 = data.highest_52_week_price;
    const referencePrice2 = data.lowest_52_week_price;
    const currentPrice = data.trade_price;

    // Calculate the percentage decrease from referencePrice1
    const decreasePercentageFromReference1 = ((currentPrice - referencePrice1) / referencePrice1) * 100;

    // Calculate the percentage increase from referencePrice2
    const increasePercentageFromReference2 = ((currentPrice - referencePrice2) / referencePrice2) * 100;

    let l = (increasePercentageFromReference2 - 100)?.toFixed(2);
    let h = 100 + decreasePercentageFromReference1;

    data['H52'] = decreasePercentageFromReference1;
    data['L52'] = increasePercentageFromReference2;
    data['DP52'] = parseFloat(l) + h; // Ensure 'l' is converted to a number

    this.coinsData[code] = data;

    const coinsMap = new Map(Object.entries(this.coinsData));
    return coinsMap;
  }
  return null;
};
  async setupWebSocket(reqCall: string) {
    try {
      if (!this.ws) {
        this.ws = new WebSocket('wss://api.upbit.com/websocket/v1');

        this.ws.onopen = () => {
          // console.log(`WebSocket opened successfully: ${reqCall}`);
          setTimeout(async () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              // console.log(`Sending data --> ${reqCall}`);
              this.ws.send(
                JSON.stringify([
                  { ticket: 'test' },
                  { type: 'ticker', codes: this.tickersRaw },
                ])
              );
            } else {
              console.error(`WebSocket not in OPEN state. Unable to send data. ${reqCall}`);
            }
          }, 1); // Adjust the delay as needed
        };

        this.ws.onclose = (e) => {
          // console.error(`WebSocket closed. ${reqCall}`, e);
          // console.log(`Close event detail: ${reqCall}`, e);
          // Implement reconnection logic here
          setTimeout(() => {
            this.setupWebSocket(reqCall); // Attempt to reconnect
            console.log(`Reconnect: ${reqCall}`, e);
          }, 1111); // Retry after 1 second (adjust as needed)

          this.ws = null; // Reset ws to allow reconnection
        };

        this.ws.onmessage = (event) => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.handleWebSocketMessageIn(event);
          } else {
            console.error(`WebSocket not in OPEN state. Unable to process incoming message. ${reqCall}`);
          }
        };
      } else {
        console.warn('WebSocket already initialized. Ignoring setup request.');
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export const sharedWebSocketService = new WebSocketService();