import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useReducer, useState } from "react";
import SubmitReportGroup from "./submitReportGroup";
import { submitReportToGroupReducer } from "../../functions/reducers";
import ClipLoader from "react-spinners/ClipLoader";
export default function ReportGroupMenu({ setReportGroup, reportGroup }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [stt, setStt] = useState(null);
  const report = (number, type) => {
    setVisible(number);
    setType(type);
  };
  const [
    { loadingReportToGroup, errorReportToGroup, reportToGroup },
    dispatchReportToGroup,
  ] = useReducer(submitReportToGroupReducer, {
    loadingReportToGroup: false,
    reportToGroup: [],
    errorReportToGroup: "",
  });

  const submitReportToGroup = async (type) => {
    try {
      setLoading(true);
      dispatchReportToGroup({ type: "SUBMIT_REPORT_GROUP_REQUEST" });
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/creatReport`,
        {
          postRef: reportGroup.postId,
          commentRef: reportGroup.commentId,
          groupRef: reportGroup.groupId,
          userReportedRef: reportGroup.userReportedRef,
          groupReportedRef: reportGroup.groupReportedRef,
          to: "adminGroup",
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Dùng setTimeout để chờ ít nhất 1 giây trước khi setLoading(false)
      setTimeout(() => {
        dispatchReportToGroup({
          type: "SUBMIT_REPORT_GROUP_SUCCESS",
          payload: data,
        });
        setLoading(false);
        setStt(null);
        report(1, type);
      }, 1000);
    } catch (error) {
      setLoading(false);
      dispatchReportToGroup({
        type: "SUBMIT_REPORT_GROUP_ERROR",
        payload: errorReportToGroup?.response.data.message,
      });
    }
  };

  return (
    <div
      className="blur"
      style={{
        alignContent: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="mmenu_report" style={{ marginTop: "100px" }}>
        <div className="box_header">
          {visible !== 0 && (
            <div
              className="small_circle hover1"
              style={{ left: "0", display: "flex", position: "absolute" }}
              onClick={() => {
                setVisible(0);
              }}
            >
              <i className="arrow_back_icon"></i>
            </div>
          )}
          {visible === 0 ? (
            <span>Report</span>
          ) : (
            <span>Thanks for reporting this post</span>
          )}

          <div
            className="small_circle hover1"
            style={{ right: "0", display: "flex", position: "absolute" }}
            onClick={() => {
              setReportGroup(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
        {visible === 0 && (
          <div>
            <div className="mmenu_main">
              <div className="mmenu_col">
                <div style={{ fontSize: "18px", fontWeight: "700" }}>
                  Report post to admins
                </div>
                <div style={{ fontSize: "15px", color: "#65676b" }}>
                  Let the admins know what's wrong with this post. We won't tell
                  the person who wrote the post that you reported it.
                </div>
              </div>
            </div>

            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("1");
                submitReportToGroup("Breaks group rule");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Breaks group rule
              </span>

              <div className="rArrow">
                {loading && stt === "1" ? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("2");
                submitReportToGroup("Irrelevant content");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Irrelevant content
              </span>
              <div className="rArrow">
                {loading && stt === "2" ? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("3");
                submitReportToGroup("False news");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                False news
              </span>
              <div className="rArrow">
                {loading && stt === "3" ? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("4");
                submitReportToGroup("Member Conflict");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Member Conflict
              </span>
              <div className="rArrow">
                {loading && stt === "4" ? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("5");
                submitReportToGroup("Spam");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>Spam</span>
              <div className="rArrow">
                  {loading && stt === "5"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("6");
                submitReportToGroup("Harassment");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Harassment
              </span>
              <div className="rArrow">
                  {loading && stt === "6"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("7");
                submitReportToGroup("Hate speech");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Hate speech
              </span>
              <div className="rArrow">
                  {loading && stt === "7"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("8");
                submitReportToGroup("Nudity or sexual activity");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Nudity or sexual activity
              </span>
              <div className="rArrow">
                  {loading && stt === "8"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("9");
                submitReportToGroup("Violence");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Violence
              </span>
              <div className="rArrow">
                  {loading && stt === "9"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setStt("10");
                submitReportToGroup("Orther");
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Orther
              </span>
              <div className="rArrow">
                  {loading && stt === "10"? (
                  <ClipLoader color="#9c9c9c" size={20} />
                ) : (
                  <i className="right_icon"></i>
                )}
              </div>
            </div>
            <div
              className="mmenu_splitter"
              style={{ marginBottom: "25px" }}
            ></div>
          </div>
        )}
        {visible === 1 && (
          <SubmitReportGroup
            setVisible={setVisible}
            type={type}
            setReportGroup={setReportGroup}
          />
        )}
      </div>
    </div>
  );
}
