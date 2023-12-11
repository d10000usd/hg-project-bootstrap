export const getCount = (items: any, type: string): number => {
    return Object.values(items)
      .filter((item: any) => (type === 'positive' ? item.signed_change_rate > 0 : item.signed_change_rate <= 0))
      .length;
  };

  export const getTopRateCount_positive= (items: any, type: string, sliseNum :number): any => {
    const top5Keys = Object.keys(items).slice(0, sliseNum); // Get the top 5 keys
  
    return top5Keys.filter((key: any) => {
      const item = items[key];
      return type === 'positive' ? item.signed_change_rate > 0 : item.signed_change_rate <= 0;
    });
  };


  export const getBottomRateCount_negative = (items: any, type: string, sliceNum: number): any => {
    const bottomKeys = Object.keys(items).slice(-sliceNum); // Get the bottom N keys
  
    return bottomKeys.filter((key: any) => {
      const item = items[key];
      return type === 'negative' ? item.signed_change_rate < 0 : item.signed_change_rate <= 0;
    });
  };