import requests
import json

# 함수 정의: 업비트 모든 코인 정보 가져오기
def get_upbit_all_coins():
    url = 'https://api.upbit.com/v1/market/all'
    response = requests.get(url)
    markets = response.json()

    coin_info = {}
    for market in markets:
        if market['market'].startswith('KRW'):
            symbol = market['market']  # 'KRW-' prefix included
            korean_name = market['korean_name']
            coin_info[symbol] = korean_name

    return coin_info

# 사용 예시: 업비트 모든 코인 정보 가져오기
all_coins_dict = get_upbit_all_coins()

# JSON 파일로 저장
with open('/Users/hg/DEV/web/hg-project-bootstrap/src/assets/coinInfo/conindict.json', 'w', encoding='utf-8') as json_file:
    json.dump(all_coins_dict, json_file, ensure_ascii=False, indent=2)

# 문자열 예시
jkj = "전기차 한파에 아크 수장 교체한 K-배터리.아크..FEOC·美대선·LFP 이더리움 등 과제 온톨로지 산적"

# 각 코인의 등장 횟수 계산
jkj_coin_count = {key: jkj.count(value) for key, value in all_coins_dict.items() if value in jkj}

# 등장 횟수를 기준으로 내림차순으로 정렬
sorted_jkj_coin_count = dict(sorted(jkj_coin_count.items(), key=lambda item: item[1], reverse=True))


print(sorted_jkj_coin_count)