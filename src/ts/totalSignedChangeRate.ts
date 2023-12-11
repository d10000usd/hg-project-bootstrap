import { computed } from 'vue';

export const totalSignedChangeRate = (rawdatas: Array<any>) => computed(() => {
  if (rawdatas && rawdatas.length > 0) {
    const total = rawdatas.reduce((sum, value) => {
      return sum + ((value?.signed_change_rate || 0) * 100);
    }, 0);

    const b = rawdatas.length;
    const a = 5000 * b * 10;
    const balance = a;
    const valuationAmount = (a + a / 100 * (total / b)).toFixed(2);
    const dayOverDayChange = (a / 100 * (total / b)).toFixed(2);
    const dayOverDayRate = (total / b).toFixed(2);
    const upbitAllBuy = b;

    const jsonData = {
      "Balance": balance,
      "Today's Valuation Amount": valuationAmount,
      "Day-over-Day Change": dayOverDayChange,
      "Day-over-Day Rate": dayOverDayRate,
      "Upbit All buy": upbitAllBuy,
    };

    return jsonData;
  } else {
    return 0;
  }
});