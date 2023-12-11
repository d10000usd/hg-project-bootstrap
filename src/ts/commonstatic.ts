
import { ref } from 'vue';
// updateCandle 함수를 내보냅니다.




function splitText(text: string): string {
  // Add your logic for splitting text here
  return text.split('-')[1]; // Replace this with your actual logic
}

export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

// 1초마다 현재 시간을 업데이트하는 함수
export function updateClock() {
  const timeElement = document.getElementById('clock');
  if (timeElement) {
    timeElement.textContent = getCurrentTime();
  }
}
// text: string    변수 : 타입
// number: number  변수 : 타입 
export async function fetchMarketCoinCandles(key: string, tickerg: string, candlecnt: number, timeInterval: string) {
  try {
    let url = null;

    if (timeInterval === "months" || timeInterval === "weeks" || timeInterval === "days") {
      // url = `https://api.upbit.com/v1/candles/${timeInterval}/?market=KRW-${splitText(tickerg)}&count=${candlecnt}`;
      url = `https://api.upbit.com/v1/candles/${timeInterval}/?market=${(tickerg)}&count=${candlecnt}`;
    } else {
      const matches = timeInterval.match(/([a-zA-Z]+)(\d+)/);
      // s'matches' is possibly 'null'. 요거 무시 할려면?
      const timetype = matches ? matches[1] : null;
      const tset = matches ? matches[2] : null;

      // url = `https://api.upbit.com/v1/candles/${timetype}/${tset}?market=KRW-${splitText(tickerg)}&count=${candlecnt}`;
      url = `https://api.upbit.com/v1/candles/${timetype}/${tset}?market=${(tickerg)}&count=${candlecnt}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    const candleData = ref(null);

    candleData.value = data;

    return candleData;
  } catch (error) {
    console.error(error);
  }
}
export async function formatedFetchCandle_1(key: string, tickerg: string, candlecnt: number, timeInterval: string) {
  try {
    let url = null;

    if (timeInterval === "months" || timeInterval === "weeks" || timeInterval === "days") {
      url = `https://api.upbit.com/v1/candles/${timeInterval}/?market=KRW-${splitText(tickerg)}&count=${candlecnt}`;
    } else {
      const matches = timeInterval.match(/([a-zA-Z]+)(\d+)/);
      const timetype = matches ? matches[1] : null;
      const tset = matches ? matches[2] : null;

      url = `https://api.upbit.com/v1/candles/${timetype}/${tset}?market=KRW-${splitText(tickerg)}&count=${candlecnt}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    const formattedData: Array<{
      time: number; // Date type를 number로 변경
      open: number;
      high: number;
      low: number;
      close: number;
    }> = [];

    data.reverse().forEach((item: any) => {
      const timestamp = new Date(item.candle_date_time_utc).getTime();
    
      const formattedEntry = {
        time: timestamp / 1000,
        open: item.opening_price,
        high: item.high_price,
        low: item.low_price,
        close: item.trade_price,
      };
    
      formattedData.push(formattedEntry);
    });

    // 데이터가 역순서로 저장됩니다.
    return formattedData; // 형식화된 데이터를 반환합니다.
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching candle data'); // Throw an error to signify that something went wrong
  }
}
export async function formatedFetchCandle(key: string, tickerg: string, candlecnt: number, timeInterval: string) {
  try {
    if (!tickerg) {
      console.warn("Invalid tickerg. Returning empty array.");
      return [];
    }

    let url = null;

    if (timeInterval === "months" || timeInterval === "weeks" || timeInterval === "days") {
      url = `https://api.upbit.com/v1/candles/${timeInterval}/?market=${(tickerg)}&count=${candlecnt}`;
    } else if (timeInterval.startsWith("minute")) {
      console.log(timeInterval)
      // 분 단위. 가능한 값 : 1, 3, 5, 15, 10, 30, 60, 240
      // const minutes = parseInt(timeInterval.replace("minutes", ""));
      const minute = parseInt(timeInterval.replace('minute', ""));
      url = `https://api.upbit.com/v1/candles/minutes/${minute}?market=${(tickerg)}&count=${candlecnt}`;
    } else {
      const matches = timeInterval.match(/([a-zA-Z]+)(\d+)/);
      const timetype = matches ? matches[1] : null;
      const tset = matches ? matches[2] : null;

      url = `https://api.upbit.com/v1/candles/${timetype}/${tset}?market=${(tickerg)}&count=${candlecnt}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("Candle data not found. Returning empty array.");
        return [];
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Received empty or invalid candle data from the API.");
      return [];
    }

    const formattedData: Array<{
      time: number; // Date type를 number로 변경
      open: number;
      high: number;
      low: number;
      close: number;
    }> = [];
    
    data.reverse().forEach((item: any) => { // 데이터를 역순서로 가져옵니다.
      if (!item.candle_date_time_utc) {
        console.warn("Missing 'candle_date_time_utc' property in API response.");
        return; // Skip this entry or handle appropriately
      }

      // ISO8601를 timestamp로 변환합니다.
      const timestamp = new Date(item.candle_date_time_utc).getTime();
    
      const formattedEntry = {
        time: timestamp/1000,
        open: item.opening_price,
        high: item.high_price,
        low: item.low_price,
        close: item.trade_price,

      };
    
      formattedData.push(formattedEntry);
    });

    return formattedData; // 형식화된 데이터를 반환합니다.
  } catch (error) {
    console.error("Error fetching or formatting candle data:", error);
    throw error; // Throw the error or handle appropriately based on your needs
  }
}
export function cal(data: any,weightValue:any) {
  let minimumPrice = data[0].low;
  let maximumPrice = data[0].high;
  let minimumDate = data[0].time;
  let maximumDate = data[0].time;
  let lastClose = data[data.length - 1].close;

  for (let i = 1; i < data.length; i++) {
    const price = data[i].high;
    const date = data[i].time;

    if (price > maximumPrice) {
      maximumPrice = price;
      maximumDate = date;
    }

    if (data[i].low < minimumPrice) {
      minimumPrice = data[i].low;
      minimumDate = date;
    }

    // Update lastClose for each iteration
    lastClose = data[i].close;
  }

  // Using the correct minimum, maximum, and last closing values now
  
  const avgPrice = (maximumPrice + minimumPrice + lastClose) / weightValue
  // const avgDate = ((new Date(maximumDate).getTime() + new Date(minimumDate).getTime()) / 2)/1000;
  const avgDate = (( maximumDate+ minimumDate) / 2);
  const result = {
    minimum: { time: minimumDate, value: minimumPrice },
    maximum: { time: maximumDate, value: maximumPrice },
    average: { time: avgDate, value: avgPrice },
    lastClose: { time: data[data.length - 1].time, value: lastClose },
    weightValue : weightValue
  };

  // Sort the result based on time
  // const sortedResult = Object.fromEntries(
  //   Object.entries(result).sort(([key1, value1], [key2, value2]) =>
  //     new Date(value1.time).getTime() - new Date(value2.time).getTime()
  //   )
  // );


  return result;
}