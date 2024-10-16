import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitReportGroup({
  setVisible,
  type,
  setReportGroup
}) {
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              className="light_blue_btn"
              style={{ width: "fit-content", borderRadius: "25px" }}
            >
              <i className="check"></i>
              <p style={{ color: "#0567D2" }}>{type}</p>
            </div>
            <div style={{ marginTop: "20px" }}>
              You reported this post to the group admins.
            </div>
          </div>
          <div
            className="mmenu_splitter"
            style={{ marginBottom: "10px", marginTop: "15px" }}
          ></div>
          <button
            className="blue_btn_requests"
            style={{ marginTop: "20px", width: "500px" }}
            onClick={() => {
              setReportGroup(false);
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
