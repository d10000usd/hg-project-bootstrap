import { ref, computed, watch, watchEffect, reactive } from 'vue';
import { WebSocketLogic } from '../stores/WebsocketConnector';
import { sendMessageAndUpdateStatus } from '../stores/TelegramMessageSender_BTC';

export class TelegramAlarmLogic {
  constructor(props, paraDict) {
    this.coinlist = ref(Object.assign([], props.message));
    this.monitoringCoin = paraDict.monitoringCoin;
    this.sortingOrderkey = ref(paraDict.sortingOrder);
    this.settingValue = ref(paraDict.settingValue);
    this.shouldExecute = paraDict.shouldExecute;
    this.messageCounter = 0;

    this.componentname = paraDict.componentname;
    this.status = paraDict.status;
    this.asc_desc = paraDict.asc_desc;
    this.coinea = paraDict.coinea;
    this.eta = paraDict.eta;
    this.addRatio = paraDict.addRatio;
    this.alarmSenddingEa = paraDict.alarmSenddingEa;
    this.maxrangeSt = paraDict.maxrange,
    this.minrangeSt = paraDict.minrange

    // initialize 메서드 호출을 run 메서드로 변경
    // this.run()


  }
    calculateRange(rangeSt) {
      const num = this.logicInstance2.sortedWsData.value[this.monitoringCoin]?.[this.sortingOrderkey.value];
      return num !== undefined ? num + (num* (rangeSt/ 100)) : null;
    };
  // 인스턴스 초기화를 위한 메서드
  initialize() {
    this.logicInstance2 = new WebSocketLogic(
      this.coinlist.value,
      "TelegramAlarmLogic_RISE",
      this.sortingOrderkey.value,
      this.asc_desc,
      this.coinea,
      this.eta
    );

    this.ticker = computed(() => this.logicInstance2.sortedWsData.value[this.monitoringCoin]?.code);
    this.trade_price = computed(() => this.logicInstance2.sortedWsData.value[this.monitoringCoin]?.trade_price);
    this.sortingOrderValue = computed(() => this.logicInstance2.sortedWsData.value[this.monitoringCoin]?.[this.sortingOrderkey.value]);
    this.maxrange = computed(() => this.calculateRange(this.maxrangeSt));
    this.minrange = computed(() => this.calculateRange(this.minrangeSt));


    
    console.log(this.sortingOrderValue);
    // this.snapshotMax = ref(null); // Initialize with null or an initial value
    // this.snapshotMin = ref(null);
    
    // Wait for the data to be available before calculating
 
   
    this.telemsg = reactive({
      
      Status: this.status,
      assets: this.ticker,
      Comparekey: this.sortingOrderkey.value,
      sortingOrderValue: this.sortingOrderValue,
      trade_price: this.trade_price,
      settingValue: this.settingValue.value,
      execution: this.componentname,
      minrange: {"r%":this.minrangeSt,v:this.minrange},
      maxrange: {"r%":this.maxrangeSt,v:this.maxrange}
 
    });

    watch(() => this.settingValue.value, (newValue) => {
      this.telemsg.settingValue = newValue;
   
    });

    watchEffect(() => {
     
      if (this.telemsg.sortingOrderValue > this.settingValue.value && this.shouldExecute) {
        this.shouldExecute = false;
        setTimeout(() => {
          this.sendMessageAndUpdateStatus();
          this.messageCounter++;

          if (this.messageCounter === this.alarmSenddingEa) {
            this.settingValue.value += this.addRatio;
            this.messageCounter = 0;
            this.telemsg["next Value"] = this.settingValue.value;
      
            this.sendMessageAndUpdateStatus();
            delete this.telemsg["next Value"];
          }

          this.shouldExecute = true;
        }, 1000);
      }
    });
  }

  // 수동으로 실행하기 위한 메서드
  run() {
    this.initialize();
    // 여기에 원하는 추가적인 실행 로직을 추가할 수 있습니다.
  }

  sendMessageAndUpdateStatus() {
    sendMessageAndUpdateStatus(this.telemsg);
  }
}