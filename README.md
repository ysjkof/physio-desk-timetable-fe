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
