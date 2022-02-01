# react-router-dom v6 바뀐 점

## Router

```js
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, CreateAccount } from "../pages";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};
// 아래로 바뀜.
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, CreateAccount } from "../pages";

export const LoggedOutRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="create-account" element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## useHistory() -> useNavigate()

[참조]("https://stackoverflow.com/questions/62861269/attempted-import-error-usehistory-is-not-exported-from-react-router-dom")

```js
import { useHistory } from "react-router-dom";
const history = useHistory();
history.push("/");
// 아래로 바뀜.
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/home");
```

# 2022-01-03; 예약하기 만드는 중

예약하기 폼과 데이터 형태를 어떻게 할지 모르겠다. 캘린더 라이브러리 [ToastUI Calendar](https://github.com/nhn/tui.calendar/blob/master/docs/getting-started.md)와 [FullCalendar](https://fullcalendar.io/docs/event-object) 사이트를 살펴봄.

```js
const ToastUI-Calendar {
  events: [
    {
      id: '1',
      calendarId: '1',
      title: 'my schedule',
      category: 'time',
      dueDateClass: '',
      start: '2018-01-18T22:30:00+09:00',
      end: '2018-01-19T02:30:00+09:00'
    },
    // more events ...
  ]
};
const FullCalendar {
  events: [
    {
      title: "BCH237",
      start: "2019-08-12T10:30:00",
      end: "2019-08-12T11:30:00",
      extendedProps: {
        department: "BioChemistry",
      },
      description: "Lecture",
    },
    // more events ...
  ]
};
// 이런 형식들로 캘린더를 설계함.
```

## 방법 두 가지

1. `start: "2018-01-18T00:00:00+09:00"`: 한국 기준 시간
2. `start: "2018-01-18T00:00:00:00Z"`: UTC(협정 세계시, Universal Time Coordinated.) 국제 표준시

- 한국 서비스만 고려한다면 +09:00으로 고정하는게 복잡한 일 안생길 거 같다.

## 날짜 라이브러리를 사용해야 할까?

- [Moment Timezone library](https://momentjs.com/timezone/)
- [Luxon library](https://moment.github.io/luxon/#/)

# 2022-01-04; 시간표 출력에 대한 고민

예약하기를 만들려다 화면에 어떻게 표현할지 생각하다 시간표 출력방법을 먼저 정해야 할 것 같다고 생각함.

toastUI calendar html을 클론하면서 확인, position absolute, relative로 여러 div를 겹치고 있음.

무지성 따라하다가 보니 flex나 grid를 사용하면 쉽게 그릴 수 있는데 왜? 하면서 flex로 고치던 중, 혹시 D&D(drag & drop) 할 때 위치 정보 때문에 position을 사용하는 건가? 하는 생각이 듬. D&D가 어떻게 이뤄지나 확인해보자.

# 2022-01-06; css 다시 공부... 백엔드 수정할 때가 걱정

flex를 부모에 넣고 자식에 뭐를 넣고 하나도 기억안나서 시간이 많이 소비되고 있다. css를 다시 공부하고 있다. 다시 백엔드를 마저 만들기 시작하먄 백엔드도 헷갈려질텐데 이걸 몇 번 반복해야 나을까?

# 2022-01-07; 랜더링 함수에 `new`를 사용하면 무한 반복에 빠진다

결론: 랜더링 함수에 `new Date()` 같은 걸 사용하면 무한 반복에 빠진다. [참조](https://stackoverflow.com/questions/59660178/overcome-endless-looping-when-executing-usequery-apolloclient-by-defining-a-ne)

`useQuery`를 테스트 하려고 `form`대신 `temporaryForm`객체를 임시로 만들어서 작동했는데 무한 반복에 빠짐. 쿼리는 잘 받아오지만 콘솔로그하면 계속 실행됨. nwe Date

```js
const temporaryForm = {
  // 갈로 안에 값을 넣으면 문제 없음.
  date: new Date("2022-1-7");,
  // 갈로 안을 비우면 문제 발생
  // date:new Date()
};
const { data } = useQuery(QUERY, {
  variables: {
      date: temporaryForm.date,
  },
});
```

# 2022-01-10; 대충 이러면 되야되는데? 하면 안된다

```js
// 원한 결과는 이렇게 네 줄이다
if (hhmm[2] === "6") handleOverMinute();
if (hhmm[2] === "7") handleOverMinute();
// 줄여서 쓰려고 이렇게 했고 원한 동작이 안나온다
if (hhmm[2] === "6" || "7") handleOverMinute();
// 그건 이렇게 했어야 했다.
if (hhmm[2] === "6" || hhmm[2] === "7") handleOverMinute();
```

그냥 "7"이라고 문자열만 써 놓으니 문자열은 true고 그래서 작동이 이상하게 됨

- 참조: [Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
- 참조: [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)

# 2022-01-12; 내일 할 일 캘린더를 그리드로 바꿔보자

position을 이용해서 만들고 있었는데 TailwindCSS 문서 overflow에서 그리드를 사용한 캘린더 예시가 있어서 그걸로 바꾸기로 결정. 내일부터 그리드로 다시 만들어보도록.

# 2022-01-14; grid-row : 시작 줄 / 끝나는 줄

`grid-row : 1 / 2` === `grid-row-start: 1 & grid-row-end: 2`
`grid-row : 1 / span 3` === `grid-row-start: 1 & grid-row-end: span 3`
`숫자` : grid line의 번호
`span` : 몇 개의 칸을 차지 할 지 설정

---

# 2022-01-14; 다음 할 일

- [x] _2022-01-16;_ 시간표 동일한 칸에 있는 예약 출력 처리( 지금은 완전히 겹쳐서 출력된다. )
- [x] _2022-01-16;_ 시간표 하루 보기에서 좌우 화살표 눌러서 하루씩 이동하기
- [x] _2022-01-17, 2022-01-18, 2022-01-24;_ 시간표 1주일 보기

# 2022-1-16; useState에서 new Date를 사용할 때, state 변경 시 ui 렌더링이 안되는 문제

결론: `useState`에서 Date 객체를 set할 때 `new Date()`를 써야 작동한다. [참조](https://stackoverflow.com/questions/64498392/react-hook-usestate-not-updating-the-ui-when-using-javascript-date-object-on-set)

```js
function App() {
  const [queryDate, setQueryDate] = useState(new Date());
  // 작동함
  const first = () => {
    const prevDate = queryDate;
    prevDate.setDate(prevDate.getDate() - 1);
    setQueryDate(new Date(prevDate));
  };
  // 작동함
  const second = () => {
    const prevDate = new Date(queryDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setQueryDate(prevDate);
  };
  // 작동안함
  const thrid = () => {
    const prevDate = queryDate;
    prevDate.setDate(prevDate.getDate() - 1);
    setQueryDate(prevDate);
  };
  return (
    <span>
      {queryDate.getMonth() + 1}월 {queryDate.getDate()}일
    </span>
  );
}
```

# 2022-1-16; 캘린더에서 absolute, relative로 위치나 크기를 설정하는 이유

- _2022-01-28_ ~~할일: Front-end, Back-end에서 중복 예약 방지~~ 게시판처럼 목록보기 추가로 해결

결론: 여러개 겹치는 캘린더는 absolute, relative와 top, bottom, left, right로 일정의 크기와 위치를 조정해야 한다. **치료실 예약 시스템에서 중복되는 시간에 입력할 경우가 거의 없기 때문에** 일단 이대로 진행하고 **Front-end, Back-end에서 중복 예약 자체을 막자**.

1. 캘린더 라이브러리들이 absolute, relative와 top, bottom, left, right로 일정의 크기와 위치를 정하길래 그렇게 만들기 시도.
2. 만들다가 TailwindCSS 문서에서 grid를 이용한 캘린더를 발견하고 생각함.

   - grid는 최신 CSS 문법이다.
   - 라이브러리들은 만든지 오래돼서 예전버전 지원을 해야 한다.
   - 그래서 grid를 사용하지 않았다.
   - 나는 최신식으로 하겠다.

   이런 사고과정 후에 grid로 바꿔서 제작을 시작.

만들어보니 한 열(row)에 한 개의 일정만 들어갈 때 문제 없고 두 개 까지도 나쁘지 않다. 하지만, 한 열에 일정이 세 개 이상 들어가면 행이든 열이든 칸이 너무 커지게 된다.

`FullCalendar`에서 일정이 겹치면 가로 사이즈를 동적으로 조절하면서 보기 좋게 하는데 grid로는 방법을 모르겠다.

# 2022-1-17; 할 일

1주일 보기일 때 너무 난잡하다. reservation-block 조정해서 시간표 칸 보기 좋게 해야된다.

- [ ] 블록을 더 간략하게 하기
  - 한 칸에 예약이 최대 2개만 있다고 가정
  - 한 칸에 예약이 2개인 경우 두 번째 걸 약간 아래, 오른쪽으로 이동해서 마우스 오버할 수 있게.

# 2022-1-18; 한 일, 할 일

- 한 일: 1주일 보기 작업 중, 빈 칸 만들기 완료.
- [x] _2022-01-24_ 1주일 보기 스케쥴 불러와서 빈 칸에 출력하기

# 2022-1-22; 한 일

- 한 일: time-table의 데이터 그리는 방법 변경. 1주 보기일 때 복잡해져서 수정함

# 2022-1-23; React components use map in map

```js
arr1.map((data, index) => {
  return (
    <div>
      <h1>{data}</h1>
      {arr2.map((data2) => {
        return <p>{data2}</p>;
      })}
    </div>
  );
});
```

# 2022-1-24; custom.css 생성

결론: TailwindCSS에서 방법을 못찾아서 css class를 손으로 직접 작성해서 custom.css에 입력함.

`col-start-[${변수}]` 이렇게 추가한 html class는 에러남.

`col-start-${변수}` 이렇게 추가한 html class는 정상적으로 나오지만 TailwindCSS가 빌드하지 않아서 아무 효과가 없음.

# 2022-1-28; list view 추가하기

- [ ] 게시판처럼 목록으로 보기 추가
  - 2022-02-01 우선순위 낮음. 최우선 리팩토링 한 뒤에 작업하는게 수월할듯함.

예약 시간이 겹쳐서 클릭할 수 없거나 볼 수 없을 때 사용
