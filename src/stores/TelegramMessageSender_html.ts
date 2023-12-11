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
<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>

<tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">
${message.text}
</code></pre>
    `;

    // Telegram API에 메시지를 전송합니다.
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
  
  messageStatus.value = result ? 'ok' : JSON.stringify(messageObject);
};



export { botToken, chatId, messageStatus, sendMessageAndUpdateStatus };



// const congratulatoryMessage = `
// <b>bold</b>, <strong>bold</strong>
// <i>italic</i>, <em>italic</em>
// <u>underline</u>, <ins>underline</ins>
// <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
// <span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
// <b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
// <a href="http://www.example.com/">inline URL</a>
// <a href="tg://user?id=123456789">inline mention of a user</a>
// <tg-emoji emoji-id="5368324170671202286">👍</tg-emoji>
// <code>inline fixed-width code</code>
// <pre>pre-formatted fixed-width code block</pre>
// <pre><code class="language-python">
// <a href="https://example.com">&#8204;</a>
// ${message.text}
// </code></pre>`+message.text;