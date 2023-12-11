// yourComponent.ts
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { backendSchema } from './backendUtils';




export const RequestData = () => {
    const responseData1 = ref('');

    const parsingdata = ref('');

    // const pdemandedUpdate = ref({
    //     id: 1,
    //     name: 'chartcoin',
    //     payload: {"search":"삼성전자 주가 가격","pages":"chartcoin plotly"},
    //     });

    // PUT 요청 처리 함수
    const updateItem = async (pdemandedUpdate) => {
        try {
            // FastAPI PUT 엔드포인트 URL
            const apiUrl = backendSchema.getUpdateNewsRouteURL(); // 1은 예제용 item_id입니다.
            // PUT 요청 보내기, 주소로 보내면 결과값을 받음
            const response = await axios.put(apiUrl, pdemandedUpdate);


            // 응답 데이터 처리
            if (response.status === 200) {
                responseData1.value = response.data;

                // console.log('Item updated successfully:', responseData1);

            }
        } catch (error) {
            if (error.response) {
                // The request was made, but the server responded with a status code outside of the 2xx range
                console.error('Error updating item:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
            }
        }

    };
    return {
        responseData1,

        updateItem,
    };
};
