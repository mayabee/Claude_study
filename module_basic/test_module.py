# 입력한 내용을 실수로 변환하여 리턴하는 함수.


# 


PI=3.141592

def number_input():
    while True:
        output = input("숫자 입력>")
        try:
            output=float(output)
        except:
            print('실수를 입력하세요')
        else:
            return output
    

def get_circumference(radius):
    return 2*PI*radius

if __name__=="__main__":
    print('둘레',get_circumference(10))