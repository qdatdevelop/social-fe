import PulseLoader from "react-spinners/PulseLoader";
export default function SubmitSharingPrivate({
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
            Sharing private images
          </div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            Sharing private images can cause serious harm. By reporting it, you
            can help prevent more harm.
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
              <li /> A friend shares a photo of a near nude person{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Someone shares a friend's nude photo as a meme{" "}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              {" "}
              <li /> Someone shares a nude photo without the person's knowledge{" "}
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
