import { ref } from 'vue'
import axios from 'axios'
import telegramini from '@/assets/telegramini.json'

// Telegram 봇의 토큰과 채팅 ID를 설정합니다.
const botToken = '6' + telegramini.t
const chatId = '1' + telegramini.i
// 메시지 상태를 추적하기 위한 ref를 생성합니다.
const messageStatus = ref('')
// 메시지 전송 함수를 생성합니다.

const sendMessage = async (message: Record<string, any>) => {


  try {
    // Telegram API에 메시지를 전송합니다.
  
    const congratulatoryMessage = `
<span class="tg-spoiler">spoiler</span>
<b>Alarm</b> - <strong>Setting values enough</strong>
<i>Value changes </i> 
<tg-emoji emoji-id="5368324170671202286">👍</tg-emoji> 
<a href="https://d10000usd.github.io/TsWebsocket_main?message=%22KRW-BTC%22">Chart</a>
${JSON.stringify(message.text, null, 2)}
`

if (congratulatoryMessage.length > 1) {
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: congratulatoryMessage,
        parse_mode: 'HTML',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // 전송 결과를 반환합니다.
    return true;
  } else {
    return false; // Fixed the syntax here
  }
  } catch (error) {
  // 오류가 발생한 경우 처리합니다.
  console.error('Error sending message:', error);
  }
};

// 메시지를 전송하고 상태를 업데이트합니다.
const sendMessageAndUpdateStatus = async (msgfromw: any) => {

    const messageObject = { text: msgfromw }
    const result = await sendMessage(messageObject)
    messageStatus.value = result ? 'ok' : 'error'
    return 1
  
}

export { botToken, chatId, messageStatus, sendMessageAndUpdateStatus }
