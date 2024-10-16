import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitNaudity({
  setVisible,
  type,
  submitReportToAdmin,
  loading
}) {
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>Nudity</div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            We only remove content that goes against our Community Standards. We
            don't allow things like:
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
              <li /> Sexual activity{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Offering or requesting sexual activity{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Female nipples (except breastfeeding, health and acts of
              protest){" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Nudity showing genitals{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Sexually explicit language{" "}
            </div>
          </div>
          <div
            className="blue_btn_requests"
            style={{ marginTop: "20px", width: "500px" }}
            disabled={loading}
            onClick={() => {
              submitReportToAdmin(type);
            }}
          >
             {loading ? <PulseLoader color="#fff" size={5} /> : "Submit"}
          </div>
          <div
            className="mmenu_splitter"
            style={{ marginBottom: "15px", marginTop: "15px" }}
          ></div>
        </div>
      </div>
    </>
  );
}
