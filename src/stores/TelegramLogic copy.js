import { ref, computed, watch, watchEffect,reactive } from 'vue';
import { WebSocketLogic } from '../stores/WebsocketConnector';
import { sendMessageAndUpdateStatus } from '../stores/TelegramMessageSender_BTC';

export default function useTelegramLogic(props) {
  const coinlist = ref(Object.assign([], props.message));
  const sortingOrder = ref('DP52');
  const settingValue = ref(150.0);
  let shouldExecute = true;
  let messageCounter = 0;
  const componentname = "TsWebsocket_telegram";
  const logicInstance2 = new WebSocketLogic(
    coinlist.value,
    "InfoScreen_categories",
    sortingOrder.value,
    "asc",
    130,
    0
  );

  const ticker = computed(() => logicInstance2.sortedWsData.value["KRW-BTC"]?.code);
  const L52Changes = computed(() => logicInstance2.sortedWsData.value["KRW-BTC"]?.L52?.toFixed(2));
  const telemsg = reactive({
    assets: ticker,
    L52Changes: L52Changes,
    execution: componentname,
    settingValue: settingValue.value,
  });
  watch(() => settingValue.value, (newValue) => {
    telemsg.settingValue = newValue;
  });

  watchEffect(() => {
    if (telemsg.L52Changes > settingValue.value && shouldExecute) {
      shouldExecute = false;
      setTimeout(() => {
        sendMessageAndUpdateStatus(telemsg);
        messageCounter++;

        if (messageCounter === 5) {
          settingValue.value += 0.5;
          messageCounter = 0;
          telemsg["next Value"] = settingValue.value;
          sendMessageAndUpdateStatus(telemsg);
          delete telemsg["next Value"];
        }

        shouldExecute = true;
      }, 1000);
    }
  });

  return {
    logicInstance2,
    settingValue,
    ticker,
    L52Changes,
  };
}