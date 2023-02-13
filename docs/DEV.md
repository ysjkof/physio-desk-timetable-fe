# 문서

![muool-scroll](https://user-images.githubusercontent.com/77876601/184348555-de09e05c-31fc-419e-8bb9-892c4dda55c7.gif)

![muool-table-option-selector](https://user-images.githubusercontent.com/77876601/184348565-9a411dd1-b5b7-421b-8bc9-ecf905306efa.gif)

![muool-edit-reservation](https://user-images.githubusercontent.com/77876601/184348574-97087bd9-5c61-4df6-8162-821c0a424aa9.gif)
![muool-quick-edit-reservation](https://user-images.githubusercontent.com/77876601/184348579-8d541f6a-9b95-45da-8e53-c3d11308f643.gif)
![muool-reservation-copy-and-past](https://user-images.githubusercontent.com/77876601/184348590-2305ac3c-5bf6-4e3c-8fbb-6d64e5103e43.gif)

![muool-dashboard-menu](https://user-images.githubusercontent.com/77876601/184348618-1bbc7c2f-b881-4f78-8eac-b8f7e9b1bf1c.gif)

![muool-create-prescription](https://user-images.githubusercontent.com/77876601/184348624-cfa48a9e-3002-4f2e-a418-bc6fd32de305.gif)

[DEV-NOTE](https://github.com/ysjkof/muool-frontend/blob/main/DEV-NOTE.md)

[DEV-DESIGN](https://github.com/ysjkof/muool-frontend/blob/main/DEV-DESIGN.md)

## 1. 작동 순서도

### 1.1. 초기 설정 불러오기

App.tsx에서 localStorage에 저장된 설정을 불러오고 비교해서 전역 변수를 설정한다.

#### 1.1.1. 사용하는 API

- `meData` : 로그인 사용자 정보 요청
- `findMyClinicsData` : 사용자의 병원 요청

#### 1.1.2. 설정하는 전역변수

- `clinicListVar` : 그룹멤버의 `activation` key를 저장하기 위해서 필요
- `selectedClinicVar` : 선택된 그룹에 따라 모든 쿼리와 앱 전반적인 UI 상호작용이 결정된다.

## 2. 스타일

### 2.1. 기본 규칙

- 기능 `custom class name`
  tailwindcss 기본 속성 (css 속성)

- 활성화
  font-semibold (font-weight:600)
- 비활성화
  opacity-50 (opacity:0.5)
- 글자 크기
  text-xs (12px, 0.75rem), **index.html에 적용**
- 큰 글자
  text-base (16px, 1rem)
- 중요하지 않은 글자 색

- 글자색
  text-gray-800, **index.html에 적용**
  - 안중요한 글자 text-gray-500,
- 아이콘 기본 크기
  14\*14
- 포인트 색상
  green-500 ( rgb(34 197 94) )

### 2.2 Header

헤더 글자 크기 : text-sm
헤더 로고 글자 : text-2xl font-black
헤더 아이콘 크기 : 24 \* 24

### 2.3 기능

#### 2.3.1 ClinicSelector of nav-side in Dashboard

- 모든 병원을 불러온다
  이 메뉴를 선택해야 통계 등을 조회할 수 있는데
  비활성이나 탈퇴한 병원을 여기서 선택할 수 없다면 메뉴를 새로 만들어야 한다
- 비활성화된 병원을 안보이게 설정할 수 있다

### 2.4 z-index

**정리완료**
reserve-btn : 10
time-indicator-bar : 31
event-box : 30 { hover: 32, DayOff : 31 }
table-labels : 32
table-sub-header : 32
TABLE_HEADER : 34
USER_VIEW_CONTROLLER : 35
dropdown menu in Header : 50(table-clinic-selector과 겹침)
Toast : 50
Tool-tip : 31
Selectbox : 50
modal-parents : 50

**추후확인**
section-layout(dashboard) 50
datepicker 50

## 3. 삭제 규칙

### 3.1 prescription은 삭제 할 수 없다

삭제 시 연결된 예약도 삭제되서 통계에서 제거된다. 그러니 삭제 말고 가려지게 할 것

## 4. public image 편집 설정

### 특정 부위 강조

#### 사용유틸: gimp v2.10

- 가장자리 페더 반경 5.0
- 둥근 모서리 반경 20.0
- 배경색 검정, 불투명 80
