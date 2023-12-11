interface CoinData {
  [key: string]: number;
  trade_price: number;
}

export const calculatePriceChange = (coinData: CoinData, referenceKey: string): string => {
  const referencePrice: number = coinData[referenceKey];
  const currentPrice: number = coinData.trade_price;
  const priceChange: number = ((currentPrice - referencePrice) / referencePrice) * 100;
  return priceChange.toFixed(2);
};