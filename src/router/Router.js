import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../component/auth/Login";
import Register from "../component/auth/Register";
import FindPw from "../component/auth/FindPw";
import Main from "../component/main/Main";
import Notification from "../component/main/Notification";
import TWrite from "../component/post/TWrite";
import Write from "../component/post/Write";
import View from "../component/post//View";
import TView from "../component/post/TView";
import Ask from "../component/post//Ask";
import AskView from "../component/post//AskView";
import MyInfo from "../component/mypage/MyInfo";
import Jitsi from "../component/videochat/jitsi";
import Header from "../component/main/Header";

/* import TRecruitment from "../component/main/TRecruitment"; */
import SRecruitment from "../component/main/SRecruitment";
import Recruitment from "../component/main/Recruitment";
import SubBanner from "../component/main/SubBanner";
import SubQuestionBanner from "../component/main/SubQuestionBanner";
import SubStudentBanner from "../component/main/SubStudentBanner";
/* import TRecruitment from "../component/main/MainStudy"; */

import Portfolio from "../component/mypage/Portfolio";
import PortfolioView from "../component/mypage/PortfolioView";
import PortfolioModify from "../component/mypage/PortfolioModify";
import MainOpenStudy from "../component/main/MainOpenStudy";
import MainQuestion from "../component/main/MainQuestion";
import MyCalendar from "../component/mypage/MyCalendar";

import MyLikedPost from "../component/mypage/MyLikedPost";
import MyLikedTPost from "../component/mypage/MyLikedTPost";
import MyLikedQuestion from "../component/mypage/MyLikedQuestion";
import ModifyTPost from "../component/post/ModifyTPost";
import ModifyPost from "../component/post/ModifyPost";
import ModifyAsk from "../component/post/ModifyAsk";
import MyPost from "../component/mypage/MyPost";
import MyAsk from "../component/mypage/MyAsk";
import MyPAReviews from "../component/mypage/MyPAReviews";

import RTCChat from "../component/class/RTCChat";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={[<Main key="main" />, <Recruitment key="recruitment" />]}
        />
        <Route
          path="/question"
          element={[<Main key="qmain" />, <MainQuestion key="question" />]}
        />
        <Route
          path="/detailQuestion"
          element={[<Header key="header" />, <SubQuestionBanner key="questionbanner" />, <MainQuestion key="question" />]}
        />

        <Route
          path="/sRecruitment"
          element={[<Main key="main" />, <SRecruitment key="srecruitment" />]}
        />

        <Route
          path="/detailsRecruitment"
          element={[<Header key="header" />, <SubStudentBanner key="studentbanner" />, <SRecruitment key="srecruitment" />]}
        />

        <Route
          path="/Recruitment"
          element={[<Header key="header" />, <SubBanner key="banner" />, <Recruitment key="recruitment" />]}
        />
        

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/findPassword" element={<FindPw />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/writeTPost" element={<TWrite />} />
        <Route path="/writePost" element={<Write />} />
        <Route path="/modifyTPost/:id" element={<ModifyTPost />} />
        <Route path="/modifyPost/:id" element={<ModifyPost />} />
        <Route path="/View/:id" element={<View />} />
        <Route path="/Ask" element={<Ask />} />
        <Route path="/modifyAsk/:id" element={<ModifyAsk />} />
        <Route path="/tView/:id" element={<TView />} />

        <Route path="/AskView/:id" element={<AskView />} />
        <Route path="/MyInfo" element={<MyInfo />} />
        <Route path="/MyCalendar" element={<MyCalendar />} />
        <Route path="/MyLikedPost" element={<MyLikedPost />} />
        <Route path="/MyLikedTPost" element={<MyLikedTPost />} />
        <Route path="/MyLikedQuestion" element={<MyLikedQuestion />} />
        <Route path="/MyPAReviews/:name" element={<MyPAReviews />} />

        <Route path="myAsk" element={<MyAsk />} />
        <Route path="myPost" element={<MyPost />} />
        <Route path="Jitsi" element={<Jitsi />} />
        <Route path="Portfolio" element={<Portfolio />} />
        <Route path="PortfolioView/:writerId" element={<PortfolioView />} />
        <Route path="PortfolioModify" element={<PortfolioModify />} />
        <Route path="/View/:id" element={<View />} />
        <Route path="myAsk" element={<MyAsk />} />
        <Route path="myPost" element={<MyPost />} />
        <Route path="/class/chat/:roomTitle" element={<RTCChat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

