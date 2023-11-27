import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  createContext,
} from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import "./App2.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Edit from "./pages/Edit.js";
import New from "./pages/New.js";
import Diary from "./pages/Diary.js";
import MyHeader from "./components/MyHeader.js";
import MyButton from "./components/MyButton.js";
export const DiaryStateContext = createContext(null);
export const DiaryDispatchContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId
          ? {
              ...it,
              content: action.newContent,
            }
          : it
      );
    }
    default:
      return state;
  }
};

const App = () => {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);
  const getData = async () => {
    setTimeout(async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      ).then((res) => res.json());

      const initData = res.slice(0, 20).map((it) => {
        return {
          author: it.email,
          content: it.body,
          emotion: Math.floor(Math.random() * 5) + 1,
          created_date: new Date().getTime(),
          id: dataId.current++,
        };
      });

      dispatch({ type: "INIT", data: initData });
    }, 2000);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({
      type: "EDIT",
      targetId,
      newContent,
    });
  }, []);

  const memoizedDispatch = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100.0;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
  /*
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatch}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
*/
  return (
    <BrowserRouter>
      <div className="App">
        <MyHeader
          headText="App"
          leftChild={
            <MyButton text={"왼쪽 버튼"} onClick={() => alert("왼쪽클릭")} />
          }
          rightChild={
            <MyButton
              text={"오른쪽 버튼"}
              onClick={() => alert("오른쪽 클릭")}
            />
          }
        />
        <h2>App.js</h2>
        <img src={process.env.PUBLIC_URL + "/assets/emotion1.png"}></img>
        <img src={process.env.PUBLIC_URL + "/assets/emotion2.png"}></img>
        <img src={process.env.PUBLIC_URL + "/assets/emotion3.png"}></img>
        <img src={process.env.PUBLIC_URL + "/assets/emotion4.png"}></img>
        <img src={process.env.PUBLIC_URL + "/assets/emotion5.png"}></img>
        <MyButton
          text={"버튼"}
          onClick={() => alert("버튼클릭")}
          type={"positive"}
        />
        <MyButton
          text={"버튼"}
          onClick={() => alert("버튼클릭")}
          type={"negative"}
        />
        <MyButton text={"버튼"} onClick={() => alert("버튼클릭")} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<New />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/diary/:id" element={<Diary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
