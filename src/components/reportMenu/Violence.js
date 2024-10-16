export default function Violence({ setVisible, setType }) {
  const report = (number, type) => {
    setVisible(number);
    setType(type);
  };
  return (
    <>
      <div className="mmenu_main">
        <div className="mmenu_col">
          <div style={{ fontSize: "18px", fontWeight: "700" }}>
            What kind of violence?
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
          report(7, "Graphic violence");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Graphic violence
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(7, "Death or severe injury");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Death or severe injury
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(7, "Violent threat");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Violent threat
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(8, "Animal abuse");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Animal abuse
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div
        className="mmenu_item hover3"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
        onClick={() => {
          report(9, "Sexual violence");
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "500" }}>
          Sexual violence
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
          Something Else
        </span>
        <div className="rArrow">
          <i className="right_icon"></i>
        </div>
      </div>
      <div className="mmenu_splitter" style={{ marginBottom: "25px" }}></div>
    </>
  );
}
