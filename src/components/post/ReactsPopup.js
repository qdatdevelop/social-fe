const reactsArray = [
  {
    name: "Like",
    image: "../../../reacts/Like.gif",
  },
  {
    name: "Love",
    image: "../../../reacts/Love.gif",
  },
  {
    name: "Haha",
    image: "../../../reacts/Haha.gif",
  },
  {
    name: "Wow",
    image: "../../../reacts/Wow.gif",
  },
  {
    name: "Sad",
    image: "../../../reacts/Sad.gif",
  },
  {
    name: "Angry",
    image: "../../../reacts/Angry.gif",
  },
];

export default function ReactsPopup({ visible, setVisible, reactHandler }) {
  return (
    <>
      {visible && (
        <div
          className="reacts_popup"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
        >
          {reactsArray.map((react, i) => (
            <div
              className="react"
              key={i}
              onClick={() => reactHandler(react.name)}
            >
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
