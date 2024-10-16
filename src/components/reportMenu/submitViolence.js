import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitViolence({
  setVisible,
  type,
  submitReportToAdmin,
  loading
}) {
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>Violence</div>
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              {" "}
              <div style={{ display: "flex" }}>
                <li /> Threats to commit violence{" "}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "400",
                  fontSize: "13px",
                }}
              >
                For example, targeting a person and mentioning a specific weapon
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              {" "}
              <div style={{ display: "flex" }}>
                <li /> Dangerous persons or organizations{" "}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "400",
                  fontSize: "13px",
                }}
              >
                For example, terrorism or a criminal organization
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              {" "}
              <div style={{ display: "flex" }}>
                <li /> Extreme graphic violence{" "}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "400",
                  fontSize: "13px",
                }}
              >
                For example, glorifying violence or celebrating suffering
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                flexDirection: "column",
              }}
            >
              {" "}
              <div style={{ display: "flex" }}>
                <li /> Another kind of violence{" "}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  fontWeight: "400",
                  fontSize: "13px",
                }}
              >
                For example, disturbing images or something else
              </div>
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
