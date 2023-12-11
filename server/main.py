# import uvicorn
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.newsdownload.newsdownload import ArticleFetcher
from app.newsdownload.from_MODULE import ColorPrinter 
# Pydantic 모델 정의
class CommandClientRequest(BaseModel):
    name: str
    payload: dict

class NewsGenerator:
    def __init__(self):
        self.bookss1 = {}

    def get_ping(self):
        ColorPrinter.LOGMODULE(f"{sys._getframe().f_code.co_name} ") 
        return JSONResponse(self.bookss1)

    def generate_news(self, item_id: int, req: CommandClientRequest):
        ColorPrinter.LOGMODULE(f"{sys._getframe().f_code.co_name} {req} done ") 
        try:
            searchdict = {"searchkeywords": req.payload["search"], "pages": req.payload["pages"]}
            article_fetcher = ArticleFetcher(searchdict)
            news_json = article_fetcher.main()
            if news_json != "Error":
                self.bookss1 = {"API": {"item_id": item_id, "req": req.dict(), "newsjson": news_json}}
                
            else:
                self.bookss1 = {"API": {"item_id": 'Error', "req": 'Error', "newsjson": 'Error'}}
                
            return JSONResponse(content=self.bookss1, status_code=200)
        except OSError:
            
            # Return an error response if OSError occurs
            error_response = {"error": "OSError occurred during news retrieval"}
            return  error_response


class AppRouter:
    def __init__(self):
        self.app = FastAPI()
        self.news_generator_instance = NewsGenerator()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # Replace with your frontend's URL in production.
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        @self.app.get("/")
        def get_ping():
            ColorPrinter.LOGMODULE(f"{sys._getframe().f_code.co_name} ") 
            return self.news_generator_instance.get_ping()

        @self.app.put("/news/{item_id}")
        def generate_news(item_id: int, req: CommandClientRequest):
            
            return self.news_generator_instance.generate_news(item_id, req)



app_router = AppRouter()
# if __name__ == "__main__":
#     uvicorn.run(app_router.app, host="172.30.1.10", port=1338)
#     # http://172.30.1.10:1338/redoc
#     # http://172.30.1.10:1338/docs