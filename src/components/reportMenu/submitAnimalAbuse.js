import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitAnimalAbuse({
  setVisible,
  type,
  submitReportToAdmin,
  loading,
}) {
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            Animal abuse
          </div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            We don't allow things like:
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#65676b",
              fontWeight: "500",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              {" "}
              <li /> Content showing, admitting to or encouraging harm against
              animals{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Staged animal fights{" "}
            </div>
          </div>
          <div
            style={{ fontSize: "16px", fontWeight: "500", marginTop: "20px" }}
          >
            We do allow:
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#65676b",
              fontWeight: "500",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              {" "}
              <li /> Content about hunting, fishing, religious sacrifice, food
              preparation and processing, pest control and self-defense{" "}
            </div>
          </div>
          <button
            className="blue_btn_requests"
            disabled={loading}
            style={{ marginTop: "20px", width: "500px" }}
            onClick={() => {
              submitReportToAdmin(type);
            }}
          >
            {loading ? <PulseLoader color="#fff" size={5} /> : "Submit"}
          </button>
          <div
            className="mmenu_splitter"
            style={{ marginBottom: "15px", marginTop: "15px" }}
          ></div>
        </div>
      </div>
    </>
  );
}
