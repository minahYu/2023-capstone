import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import styles from "./MainStudy.module.css";
import "./InfiniteScroll.css";
import StudyRoomCard from "./StudyRoomCard";

import loadingImg from "../../images/loadingImg.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCircleArrowUpFilled } from "react-icons/tb";
import { scrollToTop } from "../../util/common";
import { BASE_API_URI } from "../../util/common";

function MainStudy() {
  const [studies, setStudies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [renderQ, setRenderQ] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const limit = 12;

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState("title");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);

  function LoaderImg() {
    return (
      <div className={styles.loadingPackage}>
        <img
          className={styles.loadingImg}
          src={loadingImg}
          alt="loadingImg"
        ></img>
        <div className={styles.loading}>loading...</div>
      </div>
    );
  }

  // 검색
  const changeSelectHandler = (event) => {
    setSelected(event.target.value);
  };

  const searchResult = () => {
    console.log("btn click!!!!!!!!");
    console.log(selected);

    setSearching(true);
    setNoResult(false);

    if (searchInput === "") {
    }

    axios
      .get(
        `${BASE_API_URI}/searchStudy?selected=${selected}
          &value=${encodeURIComponent(searchInput)}
          &page=${Math.floor(searchResults.length / limit) + 1}&limit=${limit}`
      )
      .then((response) => {
        console.log("검색결과를 가져오겠습니다.");
        const newSearchStudies = response.data.studies;
        const isLastPage = newSearchStudies.length < 4;

        const { hasMore, studies } = response.data;
        const page = Math.floor(searchResults.length / limit) + 1;

        if (page === 1) setSearchResults([...studies]);
        else setSearchResults((prev) => [...prev, ...newSearchStudies]);
        setHasMore(hasMore);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchHandler = (event) => {
    event.preventDefault();
    searchResult();
    setSearchResults([]);
  };

  useEffect(() => {
    setStudies([]);
    setPage(1);
    setHasMore(true);
  }, [searchInput]);

  const moreStudies = () => {
    if (hasMore) {
      axios
        .get(
          `${BASE_API_URI}/studies?page=${
            Math.floor(renderQ.length / limit) + 1
          }&limit=${limit}`
        )
        .then((response) => {
          const { hasMore, studies } = response.data;
          const page = Math.floor(renderQ.length / limit) + 1;
          if (page === 1) setRenderQ([...studies]);
          else setRenderQ((prev) => [...prev, ...studies]);
          setHasMore(hasMore);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    moreStudies();
  }, []);

  const clickHandler = (id) => {
    axios
      .post(
        `${BASE_API_URI}/view`,
        { id: id, postName: "study" } // 서버로 전달할 id
      )
      .then((response) => {
        console.log(response.data.message);
        navigate(`/view/${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={styles.upCircle}>
        <TbCircleArrowUpFilled
          size="50"
          color="gray"
          onClick={() => {
            scrollToTop();
          }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.menu}>
          <div className={styles.select}>
            <Link to="/">
              <button className={styles.tRecruitment}>강사모집</button>
            </Link>
            <Link to="/sRecruitment">
              <button className={styles.sRecruitment}>학생모집</button>
            </Link>
            <Link to="/question">
              <button className={styles.question}>질문</button>
            </Link>
          </div>

          <div className={styles.searchAndMake} onSubmit={searchHandler}>
            <form className={styles.search}>
              <select onChange={changeSelectHandler}>
                <option value="title">제목</option>
                <option value="tags">태그</option>
                <option value="writer">작성자</option>
              </select>
              <input
                id="searchInput"
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit">검색</button>
            </form>
            <button
              className={styles.makeBtn}
              onClick={() => {
                navigate("/writePost");
              }}
            >
              만들기
            </button>
          </div>
        </div>

        <h1>Study</h1>

        {/* 검색 */}
        {searching && !noResult && (
          <InfiniteScroll
            dataLength={searchResults.length}
            next={searchResult}
            hasMore={hasMore}
            loader={<LoaderImg />}
          >
            {/* {
                            searchResults.map((data, index) => {
                            return (
                              <StudyRoomCard
                                title={data.title}
                                tags={Array.isArray(data.tag) ? [...data.tag] : []}
                                id={data._id}
                                key={Math.random()}
                                onClick={() => {
                                  clickHandler(data._id);
                                }}
                              />
                            );
                        })
                    } */}

            {searchResults.map((data, index) => {
              return (
                <StudyRoomCard
                  title={data.title}
                  tags={Array.isArray(data.tag) ? [...data.tag] : []}
                  id={data._id}
                  key={Math.random()}
                  onClick={() => {
                    clickHandler(data._id);
                  }}
                />
              );
            })}
          </InfiniteScroll>
        )}

        {noResult ? (
          <div className={styles.noResult}>
            <a>⚠️ 검색결과가 없습니다 ⚠️{noResult}</a>
          </div>
        ) : null}

        {!searching && (
          <InfiniteScroll
            dataLength={renderQ.length}
            next={moreStudies}
            hasMore={hasMore}
            loader={<LoaderImg />}
            key={Math.random() + "&&"}
          >
            {renderQ &&
              renderQ.map((data, index) => {
                return (
                  <StudyRoomCard
                    title={data.title}
                    tags={Array.isArray(data.tag) ? [...data.tag] : []}
                    id={data._id}
                    key={Math.random()}
                    onClick={() => {
                      clickHandler(data._id);
                    }}
                  />
                );
              })}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
export default MainStudy;
