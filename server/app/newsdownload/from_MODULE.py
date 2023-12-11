import sys,os,json

class ColorPrinter:
    @staticmethod
    def prRed(skk): 
        print("\033[91m {}\033[00m" .format(skk))

    @staticmethod
    def prGreen(skk): 
        print("\033[92m {}\033[00m" .format(skk))

    @staticmethod
    def prYellow(skk): 
        print("\033[93m {}\033[00m" .format(skk))

    @staticmethod
    def prLightPurple(skk): 
        print("\033[94m {}\033[00m" .format(skk))

    @staticmethod
    def prPurple(skk): 
        print("\033[95m {}\033[00m" .format(skk))

    @staticmethod
    def prCyan(skk): 
        print("\033[96m {}\033[00m" .format(skk))

    @staticmethod
    def prLightGray(skk): 
        print("\033[97m {}\033[00m" .format(skk))

    @staticmethod
    def prBlack(skk): 
        print("\033[98m {}\033[00m" .format(skk))
    @staticmethod
    def LOGMODULE_sucess(fname):
        lenth = len(fname)
        ColorPrinter.prPurple("____________________________________________________________________________")
        ColorPrinter.prYellow(" - ["+str(fname).ljust(lenth)+"]")
        ColorPrinter.prPurple("____________________________________________________________________________")
        return "-"
    @staticmethod
    def LOGMODULE(fname):
        lenth = len(fname)
        ColorPrinter.prCyan(" - ["+str(fname).ljust(lenth)+"]")
        return "-"
    @staticmethod
    def LOGMODULE_foler(fname):
        lenth = len(fname)
        
        ColorPrinter.prLightGray(" - ["+str(fname).ljust(lenth)+"]")
        return "-"

class FileReader:
    @staticmethod
    def read_file(file_path):
        with open(file_path, 'r',encoding='utf-8') as file:
            return file.read()

    @staticmethod
    def read_json(file_path):
        with open(file_path, 'r',encoding='utf-8') as file:
            return json.load(file)
    @staticmethod
    def save_json(file_path,data):
        
        with open(file_path, 'w',encoding='utf-8') as json_file:
            json_file.write(json.dumps(data, indent=4, ensure_ascii=False,))
    @staticmethod
    def createFolder(StockRoot):
        # 폴더가 있는지 확인하고 없으면 생성
       
        if not os.path.exists(StockRoot):
            os.makedirs(StockRoot)
            ColorPrinter.LOGMODULE_foler(f"{sys._getframe().f_code.co_name} :  {StockRoot} ") 
        else:
            ColorPrinter.LOGMODULE_foler(f"{sys._getframe().f_code.co_name} : {StockRoot} already exists.") 
    