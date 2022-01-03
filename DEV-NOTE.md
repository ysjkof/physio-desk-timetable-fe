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
