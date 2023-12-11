
import { sharedWebSocketService } from './WebSocketService';
import { ref,computed } from 'vue';

class WebSocketLogic {
  constructor(keysToRetrieve,compname, reqCall,typesort,rankea,startpos) {
    this.keysToRetrieve = keysToRetrieve;
    this.compname = compname
    this.reqCall = reqCall;
    this.typesort = typesort
    this.rankea = rankea
    this.startpos = startpos
    this.sortedWsData = ref([]);
    this.isWebSocketSetup = false;
    this.keysOnlyData = ref([]);
    this.valueOnlyData = ref([]);
    this.updateWsData = this.updateWsData.bind(this);
    // ws 에서 그대로 넘어오는값
    this.rawdata = ref()
    this.pncnt = ref()
    sharedWebSocketService.registerUpdateFunction(this.updateWsData);

    if (!WebSocketLogic.isWebSocketInitialized) {
      this.setupWebSocket(reqCall);
      WebSocketLogic.isWebSocketInitialized = true;
    }
    // console.log(`shared :${reqCall}`);
  }

  static isWebSocketInitialized = false;
  createFall(keysToRetrieve,compare) {
    return computed(() => {
      const filteredData = this.rawdata.value ? this.rawdata.value.filter(value => keysToRetrieve.includes(value?.code)) : [];
      
      const filteredByChangeRate = filteredData.filter(item => item?.signed_change_rate * 100 < compare);

      // let tag= `Fall rate under ${fall}`
      return {
        "changeBelow":compare,
        "state": filteredByChangeRate.length,
        "tickerMap": filteredByChangeRate.map(item => item),
        "ticker": filteredByChangeRate.map(item => item.code),
        
      };
    });
  }
  createRise(keysToRetrieve, compare) {
    return computed(() => {
      const filteredData = this.rawdata.value ? this.rawdata.value.filter(value => keysToRetrieve.includes(value?.code)) : [];
      
      const filteredByChangeRate = filteredData.filter(item => item?.signed_change_rate * 100 > compare);
      // let tag= `Rise rate upper ${rise}`
      return {
        "changeUnder":compare,
        "state": filteredByChangeRate.length,
        "tickerMap": filteredByChangeRate.map(item => item),
        "ticker": filteredByChangeRate.map(item => item.code),
       
      };
    });
  }
  createPNCnt(keysToRetrieve, rise, fall) {
    return computed(() => {
      const filteredData = this.rawdata.value ? this.rawdata.value.filter(value => keysToRetrieve.includes(value?.code)) : [];
      
      const filteredByRise = filteredData.filter(item => item?.signed_change_rate * 100 >= rise);
      const filteredByFall = filteredData.filter(item => item?.signed_change_rate * 100 < fall);
      let risetag= `Rise rate upper ${rise}`
      let falltag= `Fall rate under ${fall}`
      return {
        "Rise": filteredByRise.length,
        "Fall": filteredByFall.length,
        "ticker": {
          [risetag]: filteredByRise.map(item => item.code),
          [falltag]: filteredByFall.map(item => item.code)
        }
      };
    });
  }
  countSignedChangeRate = (values) => {
    const greaterThanZeroCount = values.filter(([, value]) => value.signed_change_rate > 0).length;
    const lessThanZeroCount = values.filter(([, value]) => value.signed_change_rate < 0).length;
    return { greaterThanZeroCount, lessThanZeroCount };
  };

  sortValuesBy = (values, typesort) => {
    

    return values
      .filter(([, value]) => value !== undefined)
      .sort((a, b) => {
        const comparison = b[1][this.reqCall] - a[1][this.reqCall];
        return typesort === 'asc' ? comparison : -comparison;
      });
  };
  sliceSortedValues(sortedValues) {
    const keysToRetrieveLength = this.keysToRetrieve.length;

    if (this.rankea >= 0 && keysToRetrieveLength > 0) {
      return Object.values(sortedValues).slice(this.startpos, this.startpos + this.rankea);
    } else if (this.rankea < 0) {
      return Object.values(sortedValues).slice(this.rankea);
    }

    return Object.values(sortedValues);
  }

  updateWsData = (data) => {
    if (!data) {
      console.warn('Received undefined data. Ignoring update.');
      return;
    }

    try {
      const retrievedValues = Object.fromEntries(
        this.keysToRetrieve.map((key) => [key, data.get(key)])
      );

      let sortedValues = this.sortValuesBy(Object.entries(retrievedValues), this.typesort);
      // 슬라이스해서 상위, 하위 만 받아오기 startpos 가 있을경우에는 해당위치에서 rankea 갯수만큼 더 가져옴
      // 정렬상태에 따라서 가져오는 방향이 다를수 있음 desc 아래방향, asc 윗방향
      sortedValues = this.sliceSortedValues(sortedValues);

      this.sortedWsData.value = Object.fromEntries(sortedValues);
      this.keysOnlyData.value = Object.keys(this.sortedWsData.value);
      this.valueOnlyData.value = Object.values(this.sortedWsData.value);
      this.rawdata.value = Object.values(this.sortedWsData.value);
      
    } catch (error) {
      console.error('Error processing WebSocket data:', error);
    }
  };


  setupWebSocket = (reqCall) => {
    return new Promise((resolve) => {
      if (!this.isWebSocketSetup) {
        sharedWebSocketService.setupWebSocket(reqCall).then(() => {
          // console.log(`WebSocket setup with reqCall: ${reqCall}`);
          this.isWebSocketSetup = true;

          resolve();
        });
      } else {
        // console.log('WebSocket already initialized. Skipping setup.');
        resolve();
      }
    });
  };
}

const useWebSocketLogic = (keysToRetrieve,compname, reqCall,typesort,rankea ,startpos,) => {
  // 서치할코인, 콤퍼넌트이름, 정렬할대상키값, 오름차순내림차순asc-desc, 정렬된겂에서가져올상하위갯수
  //rankea 양수면 위에서 가져오고, 음수면 하위에서 가져오고 updateWsData 함수에서 실행시킴
  const logicInstance = new WebSocketLogic(keysToRetrieve,compname, reqCall,typesort,rankea,startpos);
  
 
  return {
    sortedWsData: logicInstance.sortedWsData,
    keysOnlyData : logicInstance.keysOnlyData,
    valueOnlyData : logicInstance.valueOnlyData,
    rawdata : logicInstance.rawdata,
    updateWsData: logicInstance.updateWsData,
  };
};


export {  useWebSocketLogic,WebSocketLogic };
