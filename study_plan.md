# 학습 계획 — 파이썬의 엑셀 판다스 라이브러리

- 파일: `ml-python-study/pandas.ipynb`
- 시작일: 2026.05.17
- 환경: 집 노트북 / 회사 컴 (git으로 동기화)

---

## 진행 현황

### ✅ 완료
- DataFrame 생성
  - 리스트로 생성 (`pd.DataFrame(list, index, columns)`)
  - 딕셔너리로 생성 (1차원, 2차원)
- 기본 속성: `.index`, `.columns`, `.values`
- 전치: `.T`
- 불리언 인덱싱: `df[df > 90]`
- DataFrame vs Series 차이 (차원 개념, columns 유무)
- iloc의 i = integer 의미
- pd.DataFrame()은 함수가 아닌 클래스 (`__init__`, `_init_dict` 등)
- 2차원 딕셔너리로 DataFrame 생성 (바깥 키→columns, 안쪽 키→index)
- 스칼라 값 입력 시 index 필요 이유
- Series 만들기, Series vs DataFrame 차이
- `read_excel`, `read_csv` (header, index_col, dtype 옵션)
- `set_index()`, `index.name`
- 03장 데이터프레임과 시리즈 — 3.4.5(함수와 메서드·속성)까지 완료
- head/tail/describe
- 연속함수, 연속메서드
- unique(), nunique(), value_counts() (NaN 포함 여부 차이)
- describe() 해석 (right-skewed, 평균 vs 중앙값)
- 불리언 인덱싱 심화 (인덱스 일치 조건, map() 활용)
- df.plot() 시각화
- Ch.3 전체 완료 ✅

---

## 전체 학습 스케줄 (2026-05-18 ~ 2026-06-12, 주5일)

| 날짜 | 요일 | 챕터 | 주제 |
|------|------|------|------|
| 05/18 | 월 | Ch.3 | DataFrame/Series 생성, 구조 확인 |
| 05/19 | 화 | Ch.3 | CSV/Excel 불러오기·저장하기, head/tail/describe |
| 05/20 | 수 | Ch.3 | 유일값/빈도수, 복습 + pandas.ipynb 정리 |
| 05/21 | 목 | Ch.4 | loc/iloc 인덱싱, 슬라이싱 |
| 05/22 | 금 | Ch.4 | 인덱스 리셋·변경·매핑, reindex |
| 05/25 | 월 | Ch.4 | 멀티 인덱스, stack/unstack |
| 05/26 | 화 | Ch.4 | 멀티 인덱스 복습 + 엑셀예제 실습 |
| 05/27 | 수 | Ch.5 | 시리즈/DataFrame 연산, 브로드캐스팅 |
| 05/28 | 목 | Ch.5 | 통계 함수(집계, 누적), 엑셀예제 실습 |
| 05/29 | 금 | Ch.5 | Ch.4~5 전체 복습 |
| 06/01 | 월 | Ch.6 | 정렬(sort_values), 필터링(불리언 인덱싱) |
| 06/02 | 화 | Ch.6 | 결측값 처리, 중복 제거 |
| 06/03 | 수 | Ch.6 | 자료형 변환, 치환(replace), 매핑(map) |
| 06/04 | 목 | Ch.6 | 엑셀예제 실습 |
| 06/05 | 금 | Ch.6 | Ch.6 전체 복습 + QR코드 자료 확인 |
| 06/08 | 월 | Ch.8 | 열 가공, 순위(rank), 불리언 마스킹, 범주화 |
| 06/09 | 화 | Ch.9 | apply 함수, lambda, 엑셀예제 실습 |
| 06/10 | 수 | Ch.11 | 피벗 테이블(pivot_table), 교차표(crosstab) |
| 06/11 | 목 | Ch.11~12 | 언피벗(melt/stack), groupby 기초·심화 |
| 06/12 | 금 | — | 전체 복습 + lsy_audio_2023_58.csv 미니 EDA |

주말(토·일): 복습 또는 예습 자율 활용

---

## 앞으로 공부할 내용

### 1단계 — 데이터 조회 & 선택
- [ ] `loc` / `iloc` 로 행·열 선택
- [ ] 열 선택, 행 슬라이싱
- [ ] 조건 필터링 (복합 조건: `&`, `|`)

### 2단계 — 데이터 수정
- [ ] 열 추가 / 삭제 (`drop`)
- [ ] 값 변경, `rename`
- [ ] 결측값 처리: `isnull`, `fillna`, `dropna`

### 3단계 — 데이터 집계
- [ ] `groupby`
- [ ] `agg`, `apply`
- [ ] `pivot_table`

### 4단계 — 데이터 합치기
- [ ] `concat`
- [ ] `merge` / `join`

### 5단계 — 파일 입출력
- [ ] CSV 읽기/쓰기: `read_csv`, `to_csv`
- [ ] 엑셀 읽기/쓰기: `read_excel`, `to_excel`

### 6단계 — 시각화
- [ ] `df.plot()`으로 기본 차트

---

## 세션 메모

| 날짜 | 장소 | 공부한 내용 | 메모 |
|------|------|------------|------|
| 2026.05.17 | 집 | DataFrame 생성, 불리언 인덱싱 | 딕셔너리 구조 헷갈렸음 — key가 열이름 |
| 2026.05.18 | 집 | Series vs DataFrame 차원 개념, iloc/loc 차이, 클래스 구조, 2차원 딕셔너리 생성 | 값의 배열 방향으로 차원 판단하는 기준 명확히 이해 |
| 2026.05.19 | 회사 | Series, read_excel/csv, set_index, 03장 3.4.5까지 | 다음은 3.4.6부터 3.5.7까지 |
| 2026.05.19 | 집 | head/tail/describe, 연속함수, 연속메서드 | pandas.ipynb에 markdown 셀 추가 |
| 2026.05.20 | 집 | unique/nunique/value_counts, describe 해석, 불리언 인덱싱 심화, plot | Ch.3 전체 완료, 내일 Ch.4 loc/iloc 시작 |
