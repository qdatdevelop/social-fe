export default function Naudity({ setVisible, setType}) {
  const report = (number, type) => {
    setVisible(number);
    setType(type);
  };
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            What kind of nudity?
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
          report(5, "Adult nudity");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Adult nudity
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(5, "Sexually suggestive");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Sexually suggestive
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(5, "Sexually service");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Sexually service
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(6, "Sharing private images");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Sharing private images
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
    
      <div className="mmenu_splitter" style={{ marginBottom: "25px" }}></div>
    </>
  );
}
