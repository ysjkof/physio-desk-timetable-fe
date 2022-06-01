# 문서

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
  opacity-70 (opacity:0.7)
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

#### 2.3 Header

헤더 글자 크기 : text-sm
헤더 로고 글자 : text-2xl font-black
헤더 아이콘 크기 : 24 \* 24
