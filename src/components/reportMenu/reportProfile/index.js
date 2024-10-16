import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Naudity from "../Naudity";
import { useSelector } from "react-redux";

import axios from "axios";
import SubmitProfile from "./Submit";
import { submitReportToGroupReducer } from "../../../functions/reducers";
export default function ReportMenu_Profile({
  setReport_Profile,
  report_Profile,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [type, setType] = useState(null);
  const [visible, setVisible] = useState(false);
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
          postRef: report_Profile.postId,
          commentRef: report_Profile.commentId,
          groupRef: report_Profile.groupId,
          userReportedRef: report_Profile.userReportedRef,
          groupReportedRef: report_Profile.groupReportedRef,
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
        setReport_Profile(false);
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
          {visible && (
            <div
              className="small_circle hover1"
              style={{ left: "0", display: "flex", position: "absolute" }}
              onClick={() => {
                setVisible(false);
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
              setReport_Profile(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
        {!visible && (
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
                setType("Fake account")
                setVisible(true);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Fake account
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setType("Fake name")
                setVisible(true);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Fake name
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setType("Posting inappropriate things")
                setVisible(true);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Posting inappropriate things
              </span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div
              className="mmenu_item hover3"
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              onClick={() => {
                setType("Something else")
                setVisible(true);
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Something else
              </span>
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

        {visible && (
          <SubmitProfile
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
