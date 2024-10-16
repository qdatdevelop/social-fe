export default function FalseInformation({ setVisible, setType }) {
  const report = (number, type) => {
    setVisible(number);
    setType(type);
  };
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            What kind of false information?
          </div>
          <div style={{ fontSize: "15px", color: "#65676b" }}>
            If someone is in immediate danger, get help before reporting to
            Facebook. Don't wait.
          </div>
        </div>
      </div>
      <div className="mmenu_splitter"></div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(10, "Adult nudity");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Health</span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(10, "Sexually suggestive");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Politics</span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(10, "Sexually service");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Social issue
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(10, "Sharing private images");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Something else
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div className="mmenu_splitter" style={{ marginBottom: "25px" }}></div>
    </>
  );
}
