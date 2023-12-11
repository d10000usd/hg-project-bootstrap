from concurrent.futures import ThreadPoolExecutor
import os,re,sys
import json
from collections import Counter
import asyncio
import aiohttp
import pandas as pd


from newspaper import Article
try:
    from .stockticker import stockticker 
    from .cointicker import cointicker 
    from .from_MODULE import ColorPrinter 
except ModuleNotFoundError as e:
    # Handle the error and provide additional information
    print(f"Error: {e}")
    print("Possible solutions:")
    print("1. Check if the 'app' module exists in the specified path.")
    print("2. Verify that the path to 'app' is accurate.")
    print("3. Ensure there is an '__init__.py' file inside the 'app' directory.")
    print("4. Confirm that module names match actual filenames.")
class ArticleFetcher:
    ColorPrinter.LOGMODULE("Start Search -----------------------------------------------") 
    ColorPrinter.LOGMODULE(f"{sys._getframe().f_code.co_name} ") 
    def __init__(self, search):
        filename = re.sub(' ', '_', search["searchkeywords"])
        self.searchkey = search["searchkeywords"]
        newsLinkDownload = NewsLinkDownload(search)
   
        self.links = newsLinkDownload.main()

        self.folder = filename
        self.saveroot = "/Users/hg/DEV/WebDocuments/public/blog"
        self.saveroot_folder = f"{self.saveroot}/{ self.folder }"
        self.filename = f"{self.folder}.json"
        self.savepath = f"{self.saveroot_folder}/{self.filename}"
        self.filteredLink = None

        self.removal_list = ['으','으며','있습니다','있습니','있으며','있','있다','중','다시', '꽉', '서', '면에서', '에서', '이어', '한', '총', '까지', '이후', '것이란', '까지', '하다고', '및', '등', '의', '있다고', '다시', '폐', '읽음', '지나', '쑥', '대비', '대한', '왜',
                     '최근','을', '있기', '은', '는', '이', '가', '을', '를', '으로', '로', '와', '과',  '부터', '까지', '에', '에서', '에게', '한테', '에게서', '한테서', '만', '이랑', '랑', '수', '있다', '이렇게', '것', '다']
  

    def count_occurrences(self,sentence):
        # Get ticker keys
        ticker_dict = stockticker()
        ticker_keys = list(ticker_dict.keys())
        
        # Count occurrences of each ticker in the sentence
        occurrences = [{ticker: sentence.count(ticker) for ticker in ticker_keys if ticker in sentence}]
        sorted_stock_data = [dict(sorted(occurrences[0].items(), key=lambda x: x[1], reverse=True))]

        return sorted_stock_data
    
    def conintickerFind(self,sentence):
        ticker_dict = cointicker()
        # # 한글이름 뽑을 경우
        # jkj_coin_count = dict(map(lambda x: (x, sentence.count(x)), filter(lambda x: x in sentence, ticker_dict.values())))
        # sorted_jkj_coin_count = dict(sorted(jkj_coin_count.items(), key=lambda item: item[1], reverse=True))
       
    
        # 각 코인의 등장 횟수 계산
        jkj_coin_count = {key: sentence.count(value) for key, value in ticker_dict.items() if value in sentence}
        # 등장 횟수를 기준으로 내림차순으로 정렬
        sorted_jkj_coin_count = dict(sorted(jkj_coin_count.items(), key=lambda item: item[1], reverse=True))

        return sorted_jkj_coin_count
    def fetch_info(self, link):
        try:
            article = Article(link, language='ko')
            article.download()
            article.parse()
        except OSError:
        # Handle the exception as needed
            pass  
        try:   
            if len(article.title) > 3 and len(article.text) > 60 and len(article.text) < 3000 and len(str(article.publish_date)) > -1:
                article.nlp()
                # filtered_words = self.editkeywords(article.keywords)


                stockcounts=self.count_occurrences(article.text)
                coincounts = self.conintickerFind(article.text)

                searchkeycount = self.filter_and_count(article.text,self.searchkey)
                dicts = {
                            'title': article.title,
                            'newstext': article.text,
                            'summary': article.summary,
                            'gentime': str(article.publish_date),
                            'img': article.top_image,
                            'link': link,
                            'keywords': article.keywords,
                            'stockerticker' : stockcounts,
                            "searchkeycount" :searchkeycount,
                            "coincounts" : coincounts
                        }
                return dicts
        except OSError:
            # Handle the exception as needed
            pass
    def editkeywords(self, keywordsList):
        return [''.join(char for char in word if char not in self.removal_list and char != ' ') for word in keywordsList if word.strip()]
   

    def filter_and_count(self, source_text, search_key):
        # Removing unwanted characters and splitting words
        words_source = [''.join(char for char in word if char not in self.removal_list) for word in source_text.split()]
        words_search = [''.join(char for char in word if char not in self.removal_list) for word in search_key.split()]

        # Using Counter to count occurrences efficiently
        word_count_dict = dict(Counter(words_source))

        # Filtering based on the search_key
        filtered_word_count_dict = {word: word_count_dict.get(word, 0) for word in words_search}
        # result_dict = {word: sum for word, sum in filtered_word_count_dict.items() if sum >= 1}
        return filtered_word_count_dict


    def fetch_all(self):
        with ThreadPoolExecutor() as executor:
            
            results = list(executor.map(self.fetch_info, self.links))

        return results
    def getStockExistCount(self, result):
        # 중복된 값을 더해서 딕셔너리에 저장
        stocker_dict = {}
        for item in result:
            stockerticker = item.get("stockerticker", [{}])[0]
            for key, value in stockerticker.items():
                stocker_dict[key] = stocker_dict.get(key, 0) + value
        stocker_dict = dict(sorted(stocker_dict.items(), key=lambda x: x[1], reverse=True))
        return stocker_dict  # Return the dictionary instead of printing it
    def calculate_product(self,entry):
        product = 1
        for value in entry["searchkeycount"].values():
            product *= value
        entry["product"] = product
        return product
    def main(self):
        try:
            results = self.fetch_all()
            results = list(filter(lambda x: x is not None, results))
            

            stocker_count = self.getStockExistCount(results)

            sorted_news_contents = sorted(results, key=self.calculate_product, reverse=True)
            senddict={"newscontents":sorted_news_contents,"company":stocker_count}
            # results.append(stocker_count)
            self.save_results(senddict)
            
            
            return senddict
        except OSError:
            # Return an error response if OSError occurs
            error_response = {"error": "OSError occurred during news retrieval"}
            return  error_response
        
    def save_results(self, results):
        try:
            if not os.path.exists(f"{self.saveroot_folder}"):
                os.makedirs(f"{self.saveroot_folder}")
            with open(self.savepath, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            # print(self.savepath)
        except OSError:
            print('Error: Creating directory/file. ')

class NewsLinkDownload():
    ColorPrinter.LOGMODULE(f"{sys._getframe().f_code.co_name} ")
    def __init__(self, search) -> None:
        
        self.search = search["searchkeywords"]
        self.pages = search["pages"]
        self.savepath = "/Users/hg/DEV/WebDocuments/public/blog"
        
    def extract_article_urls(self, document: str):
        document = document[document.find('<ul class="list_news">'):]
        document = document[: document.find('<div class="banner_area">')]
        list1 = document[: document.find("</ul>")]
        list2 = document[document.find("</ul>") + 5:]
        list2 = list2[: list2.find("</ul>")]
        document = list1 + list2
        article_urls = []
        while "<li" in document:
            document = document[document.find('<div class="dsc_wrap">'):]
            container = document[: document.find("/div")]
            if not container.strip():
                continue
            article_urls.append(re.search(r'href="(.*?)"', container).group(1))
            document = document[document.find("/li"):]
        return article_urls

    async def fetch(self, session, url):
        async with session.get(url) as response:
            doc = await response.text()
            document = self.extract_article_urls(doc)
            return document

    async def linkmain(self, naverdict):
        async with aiohttp.ClientSession() as session:
            url = "https://search.naver.com/search.naver?where=news&sm=tab_pge&query={code}&start={page}&sort=1"
            futures = [asyncio.ensure_future(self.fetch(session, url.format(code=naverdict["검색어"], page=i)))
                       for i in range(1, self.pages  + 1)]
            result = await asyncio.gather(*futures)
            return result

    def link_generate_main(self, naverdict):
        result = asyncio.run(self.linkmain(naverdict))
        
        link_lists = []
        for i, _ in enumerate(result):
            for idx, _ in enumerate(result[i]):
                link_lists.append(result[i][idx])
        link_lists = list(set(link_lists))
        df = pd.DataFrame(link_lists, columns=['links'])
        df = df[~df['links'].str.contains("naeil|vop|newsen|zdnet|mydaily|kbs|jbnews|m-i|nbntv|laborplus|yna", na=False, case=False)]
        df = df[~df['links'].str.contains('naeil|vop|newsen|zdnet|mydaily|topstarnews|pinpointnews|wowtv|medigatenews|celuvmedia|mk|imaeil|jbnews|yna')]
        df = df.drop_duplicates(['links'], keep='last')
        return df['links'].tolist()

    def main(self):
        filename = re.sub(' ', '_', self.search)
        search_info = {"검색어": self.search, "검색페이지수": self.pages, "파일이름": filename, "searchtype": "news"}
        search_keyword = {"검색어": search_info["검색어"]}
        results = self.link_generate_main(search_keyword)
    


        return results
    
# if __name__ == "__main__":
#     searchdict = {"searchkeywords": "삼성전자", "pages": 1}
#     article_fetcher = ArticleFetcher(searchdict)
#     news_json = article_fetcher.main()