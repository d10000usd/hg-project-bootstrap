function cal(ohlcdata:any){
    let minimumPrice = ohlcdata[0].low;
      let maximumPrice = minimumPrice;
      let minimumDate = ohlcdata[0].time;
      let maximumDate = ohlcdata[0].time;
      for (let i = 1; i < ohlcdata.length; i++) {
        const price = ohlcdata[i].high;
        const date = ohlcdata[i].time;
        if (price > maximumPrice) {
          maximumPrice = price;
          maximumDate = date;
        }
        if (price < minimumPrice) {
          minimumPrice = price;
          minimumDate = date;
        }
      }
      const avgPrice = (maximumPrice + minimumPrice) / 2;
      const avgDate = (maximumDate + minimumDate) / 2;
      return {
        minimum: { price: minimumPrice, date: minimumDate },
        maximum: { price: maximumPrice, date: maximumDate },
        average: { price: avgPrice, date: avgDate },
      };
  }