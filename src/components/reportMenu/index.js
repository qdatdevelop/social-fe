import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Naudity from "./Naudity";
import { useSelector } from "react-redux";

import axios from "axios";
import SubmitNaudity from "./submitNaudity";
import SubmitSpam from "./submitSpam";
import Violence from "./Violence";
import SubmitSharingPrivate from "./submitSharingPrivate";
import SubmitViolence from "./submitViolence";
import SubmitAnimalAbuse from "./submitAnimalAbuse";
import SubmitSexualViolence from "./submitSexualViolence";
import FalseInformation from "./FalseInformation";
import SubmitCommunityStandards from "./submitCommunityStandards";
import { submitReportToGroupReducer } from "../../functions/reducers";
export default function ReportMenu({ setReport, report }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [type, setType] = useState(null);
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);
  const [
    { loadingReportToGroup, errorReportToGroup, reportToGroup },
    dispatchReportToGroup,
  ] = useReducer(submitReportToGroupReducer, {
    loadingReportToGroup: false,
    reportToGroup: [],
    errorReportToGroup: "",
  });

  const submitReportToAdmin = async (type) => {
    try {
      setLoading(true);
      dispatchReportToGroup({ type: "SUBMIT_REPORT_GROUP_REQUEST" });
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/creatReport`,
        {
          postRef: report.postId,
          commentRef: report.commentId,
          groupRef: report.groupId,
          userReportedRef: report.userReportedRef,
          groupReportedRef: report.groupReportedRef,
          to: "adminFacebook",
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTimeout(() => {
        dispatchReportToGroup({
          type: "SUBMIT_REPORT_GROUP_SUCCESS",
          payload: data,
        });
        setLoading(false);
        setReport(null);
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
      <div className="mmenu_report">
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

          <span>Report</span>
          <div
            className="small_circle hover1"
            style={{ right: "0", display: "flex", position: "absolute" }}
            onClick={() => {
              setReport(null);
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
                  Please select a problem
                </div>
                <div style={{ fontSize: "15px", color: "#65676b" }}>
                  If someone is in immediate danger, get help before reporting
                  to Facebook. Don't wait.
                </div>
              </div>
            </div>
            <div className="mmenu_splitter"></div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setVisible(1);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Nudity
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setVisible(2);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Violence
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setVisible(3);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                False infomation
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setType("Spam")
                setVisible(4);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>Spam</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_splitter"
              style={{ marginBottom: "25px" }}
            ></div>
          </div>
        )}
        {visible === 1 && <Naudity setVisible={setVisible} setType={setType} />}
        {visible === 2 && (
          <Violence setVisible={setVisible} setType={setType} />
        )}
        {visible === 3 && <FalseInformation setVisible={setVisible} />}
        {visible === 4 && (
          <SubmitSpam
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 5 && (
          <SubmitNaudity
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 6 && (
          <SubmitSharingPrivate
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 7 && (
          <SubmitViolence
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 8 && (
          <SubmitAnimalAbuse
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 9 && (
          <SubmitSexualViolence
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
        {visible === 10 && (
          <SubmitCommunityStandards
            setVisible={setVisible}
            type={type}
            submitReportToAdmin={submitReportToAdmin}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
