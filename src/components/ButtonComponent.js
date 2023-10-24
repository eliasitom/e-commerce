import "../styleSheets/ButtonComponent.css";

const ButtonComponent = ({ child, width, height, margin, onClick }) => {
  return (
    <button
      className="button-component"
      onClick={onClick}
      style={{
        width: width ? width : "200px",
        height: height ? height : "40px",
        marginTop: margin ? margin.top : "0",
        marginRight: margin ? margin.right : "0",
        marginBottom: margin ? margin.bottom : "0",
        marginLeft: margin ? margin.left : "0",
      }}
    >
      <p>{child}</p>
    </button>
  );
};

export default ButtonComponent;
