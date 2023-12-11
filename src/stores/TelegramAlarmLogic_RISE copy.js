import { ref, computed, watch, watchEffect, reactive } from 'vue';
import { WebSocketLogic } from '../stores/WebsocketConnector';
import { sendMessageAndUpdateStatus } from '../stores/TelegramMessageSender_BTC';

export class TelegramAlarmLogic_RISE {
  constructor(props,paraDict) 
  {
    this.coinlist = ref(Object.assign([], props.message));
    this.sortingOrder = ref(paraDict.value.sortingOrder);
    this.settingValue = ref(150.0);
    this.shouldExecute = true;
    this.messageCounter = 0;
    this.componentname = "TsWebsocket_telegram";
    this.status = 'Rise Monitoring'
    this.logicInstance2 = new WebSocketLogic(
      this.coinlist.value,
      "InfoScreen_categories",
      this.sortingOrder.value,
      "asc",
      130,
      0
    );

    this.ticker = computed(() => this.logicInstance2.sortedWsData.value["KRW-BTC"]?.code);
    this.L52Changes = computed(() => this.logicInstance2.sortedWsData.value["KRW-BTC"]?.L52?.toFixed(2));
    this.telemsg = reactive({
      Status : this.status, 
      assets: this.ticker,
      L52Changes: this.L52Changes,
      execution: this.componentname,
      settingValue: this.settingValue.value,
    });

    watch(() => this.settingValue.value, (newValue) => {
      this.telemsg.settingValue = newValue;
    });

    watchEffect(() => {
      if (this.telemsg.L52Changes > this.settingValue.value && this.shouldExecute) {
        this.shouldExecute = false;
        setTimeout(() => {
          this.sendMessageAndUpdateStatus();
          this.messageCounter++;

          if (this.messageCounter === 1) {
            this.settingValue.value += 0.5;
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

  sendMessageAndUpdateStatus() {
    sendMessageAndUpdateStatus(this.telemsg);
  }
}
