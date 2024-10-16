import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitCommunityStandards({
  setVisible,
  type,
  submitReportToAdmin,
  loading
}) {
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            Does this go against our Community Standards?
          </div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            Our standards explain what we do and don't allow on Facebook. We
            review and update our standards regularly, with the help of experts.
          </div>
          <div
            className="hover6"
            style={{
              fontSize: "15px",
              color: "#0866FF",
              fontWeight: "500",
              marginTop: "10px",
            }}
          >
            See Community Standards
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
