# test_module을 import하여 입력한 숫자를 받아오고 main.py에서 둘레를 구하는 코드

import test_module as test

radius = test.number_input()
print(test.get_circumference(radius))
