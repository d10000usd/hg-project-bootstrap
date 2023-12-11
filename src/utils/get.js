// yourComponent.ts
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { backendSchema } from './backendUtils';

export const getFromServerData = () => {
  const responseData = ref('');
  const parsingdata = ref('');

  const fetchData = async () => {
    try {
      const response = await axios.get(backendSchema.getPingRouteURL());

      if (response) {
        responseData.value = response.data.API;
        parsingdata.value = responseData.value;
      } else {
        console.log('백엔드 호출 중 오류 발생: ' + String(error));
        responseData.value = '응답이 없습니다.';
      }
    } catch (error) {
      console.log('백엔드 호출 중 오류 발생: ' + String(error));
      if (error.message === 'Network Error') {
        responseData.value = error.config.url + '에서 백엔드가 실행 중인지 확인해주세요.';
      } else {
        responseData.value = '죄송합니다. 오류가 발생했습니다.';
      }
    }
  };

  onMounted(async () => {
    // fetchData()
  });

  return {
    responseData,
    parsingdata,
    fetchData,
  };
};