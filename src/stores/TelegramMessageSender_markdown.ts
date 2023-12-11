import { ref } from 'vue';
import axios from 'axios';
import telegramini from "@/assets/telegramini.json"

// Telegram 봇의 토큰과 채팅 ID를 설정합니다.
const botToken = "6"+telegramini.t;
const chatId = "1"+telegramini.i;
// 메시지 상태를 추적하기 위한 ref를 생성합니다.
const messageStatus = ref('');
// 메시지 전송 함수를 생성합니다.
const sendMessage = async (message: Record<string, any>) => {
  try {
    // Telegram API에 메시지를 전송합니다.

const congratulatoryMessage = `
**Best Regards,**
\`inline fixed-width code\`
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![👍](tg://emoji?id=5368324170671202286)
\`\`\`block fixed-width code\`\`\`
    `;

    // Telegram API에 메시지를 전송합니다.
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: congratulatoryMessage,
        parse_mode: 'MarkdownV2',
      },
      { headers: { 'Content-Type': 'application/json' } } 
    );

    // 전송 결과를 반환합니다.
    return response.data;
  } catch (error) {
    // 오류가 발생한 경우 처리합니다.
    console.error('Error sending message:', error);
  }
};

// 메시지를 전송하고 상태를 업데이트합니다.
const sendMessageAndUpdateStatus = async (msgfromw: any) => {
  const messageObject = { text: JSON.stringify(msgfromw, null, 2) };
  console.log(messageObject);
  const result = await sendMessage(messageObject);
  
  messageStatus.value = result ? result : JSON.stringify(messageObject);
};



export { botToken, chatId, messageStatus, sendMessageAndUpdateStatus };