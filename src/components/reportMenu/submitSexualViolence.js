import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitSexualViolence({
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
            Sexual violence
          </div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            Our Community Standards help guide what isn’t allowed on Facebook.
            For sexual violence, you can report things such as:
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#65676b",
              fontWeight: "500",
              marginTop: "20px",
            }}
          >
            <div style={{ display: "flex" }}>
              {" "}
              <li /> Sexual touching without consent{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Asking for imagery or descriptions of sexual violence{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Threatening to share imagery or descriptions of sexual
              violence{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Mocking victims of sexual violence{" "}
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
