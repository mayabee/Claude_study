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
- Series 만들기, Series vs DataFrame 차이
- `read_excel`, `read_csv` (header, index_col, dtype 옵션)
- `set_index()`, `index.name`
- 03장 데이터프레임과 시리즈 — 3.4.5(함수와 메서드·속성)까지 완료

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
| 2026.05.19 | 회사 | Series, read_excel/csv, set_index, 03장 3.4.5까지 | 다음은 3.4.6부터 3.5.7까지 |
