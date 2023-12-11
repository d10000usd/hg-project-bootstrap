// YourComponentLogic.ts
import { ref, computed, watch, onMounted } from 'vue';
import { useWebSocketLogic } from '../stores/WebsocketConnector';
import { formatNumberWithSuffix } from "../ts/formatNumberWithSuffix";
import { getCount } from '../ts/risefall';
import DynamicCategorizing from "@/assets/coinInfo/DynamicCategorizing.json";

export default function useYourComponentLogic(props) {
  const coinlist = ref(Object.assign([], props.message));
  const sortingOrder = ref('signed_change_rate');
  const typesort = ref('asc');
  const selectedKey = ref(null);
  const codeAndRateArray = ref([]);
  const filteredDataList = ref();
  const commonValues = ref();  // Add this line to declare commonValues

  let { sortedWsData: data, keysOnlyData: keysOnly, rawdata: rawdatas } = useWebSocketLogic(coinlist.value, "InfoScreen_categories", sortingOrder.value, "asc", 130, 0);

  const calculateTotalSignedChangeRate = (data) => {
    if (!data || data.length === 0) return 0;

    const minbuy = 5000;
    const buyea = 1;
    const total = data.reduce((sum, value) => sum + ((value?.signed_change_rate || 0) * 100), 0);
    const b = data.length;
    const a = minbuy * b * buyea;

    const balance = a;
    const valuationAmount = String((a + a / 100 * (total / b)).toFixed(2));
    const dayOverDayChange = String((a / 100 * (total / b)).toFixed(2));
    const dayOverDayRate = Number((total / b).toFixed(2));
    const upbitAllBuy = String(b);

    return {
      "Balance ": balance,
      "Amount  ": valuationAmount,
      "Change  ": dayOverDayChange,
      "Rate    ": dayOverDayRate,
      "Upbitbuy": upbitAllBuy,
    };
  };

  const totalSignedChangeRate = computed(() => calculateTotalSignedChangeRate(rawdatas.value));

  const totalSignedChangeRate_selcted = computed(() => {
    const filteredData = rawdatas.value ? rawdatas.value.filter(value => tokenValuesKRW.value.includes(value?.code)) : [];

    filteredDataList.value = filteredData;
    codeAndRateArray.value = filteredData.map(item => ({
      code: item.code,
      rate: Number(((item?.signed_change_rate || 0) * 100).toFixed(2)),
    }));

    return calculateTotalSignedChangeRate(filteredData);
  });

  const pncnt = computed(() => {
    const filteredData = rawdatas.value ? rawdatas.value.filter(value => tokenValuesKRW.value.includes(value?.code)) : [];

    const countGreaterZero = filteredData.filter(item => item?.signed_change_rate >= 0).length;
    const countLessZero = filteredData.filter(item => item?.signed_change_rate < 0).length;

    return {
      "Rise": countLessZero,
      "Fall": countGreaterZero,
    };
  });

  const pncntall = computed(() => {
    const filteredData = rawdatas.value ? rawdatas.value.filter(value => coinlist.value.includes(value?.code)) : [];

    const countGreaterZero = filteredData.filter(item => item?.signed_change_rate >= 0).length;
    const countLessZero = filteredData.filter(item => item?.signed_change_rate < 0).length;

    return {
      "Rise": countLessZero,
      "Fall": countGreaterZero,
    };
  });

  const toggleSortOrder = (order) => {
    if (sortingOrder.value === order) {
      typesort.value = typesort.value === 'desc' ? 'asc' : 'desc';
    } else {
      sortingOrder.value = order;
      typesort.value = 'desc';
    }
    data = useWebSocketLogic(coinlist.value, "InfoScreen_categories", sortingOrder.value, typesort.value, 130, 0).sortedWsData;
  };

  const selectedValue = ref({
    "Suggestcoin": keysOnly,
  });

  const RecomandCoin = ref({
    "Suggestcoin": {
      "Amount": totalSignedChangeRate_selcted,
      "buy": codeAndRateArray,
      "pncnt": pncnt,
    },
    "UpbitAll": {
      "Amount": totalSignedChangeRate,
      "pncnt": pncntall,
    },
    "Amount": {
      "Amount": totalSignedChangeRate_selcted,
      "pncnt": pncnt,
    },
  });

  const getKeyForToken = (token) => {
    for (const category in DynamicCategorizing) {
      if (DynamicCategorizing[category].includes(token)) {
        return category;
      }
    }
    return 'Smart Contract Platforms';
  };

  const getValuesForKey = (key) => DynamicCategorizing[key] || [];
  const tokenCategory = computed(() => getKeyForToken(selectedValue.value));
  const tokenValuesKRW = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("", "")));
  const tokenValues = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("KRW-", "")));

  const isValueInTokenValuesKRW = (value) => tokenValuesKRW.value.includes(value);
  const isValueInTokenValues = (value) => tokenValues.value.includes(value);

  onMounted(() => {
    updateCommonValues();
  });

  watch([coinlist, tokenValues], () => {
    updateCommonValues();
  });

  function updateCommonValues() {
    commonValues.value = coinlist.value.filter(value => isValueInTokenValuesKRW(value));
  }
  const displayValue = (key) => {
    selectedKey.value = key;
  };

  function handleButtonClick(index) {
    selectedValue.value = index;
  }

  return {
    data,
    keysOnly,
    rawdatas,
    sortingOrder,
    typesort,
    selectedKey,
    codeAndRateArray,
    filteredDataList,
    totalSignedChangeRate,
    totalSignedChangeRate_selcted,
    pncnt,
    pncntall,
    toggleSortOrder,
    selectedValue,
    RecomandCoin,
    tokenCategory,
    tokenValuesKRW,
    tokenValues,
    isValueInTokenValuesKRW,
    isValueInTokenValues,
    displayValue,
    handleButtonClick,
    commonValues
  };
}
