import axios from 'axios';

async function fetchJsonData(url: string): Promise<any> {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch JSON data');
    }
  } catch (error: any) {
    // 'error' 변수를 명시적으로 'any' 타입으로 선언
    throw new Error('Failed to fetch JSON data: ' + error.message);
  }
}

export async function GitJsonRead() {
  const jsonUrl = 'https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/mkdocs_posts_nav.json';

  try {
    const jsonData = await fetchJsonData(jsonUrl);
    // jsonData 에서 원하는 작업을 수행하세요.
    // 예를 들어, jsonData를 TypeScript 객체로 파싱한 후 사용할 수 있습니다.
    // 예: const parsedData = JSON.parse(jsonData);
    // console.log('JSON 데이터 가져오기 성공:', jsonData);
    return jsonData;
  } catch (error: any) {
    console.error('오류 발생:', error.message);
    throw error;
  }
}
