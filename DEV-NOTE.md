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
