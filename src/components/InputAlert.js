import { useEffect, useState } from "react";

const InputAlert = ({ text, duration, endAlert }) => {
  const [active, setActive] = useState(true);

  const handleAlert = () => {
    let timer = duration;
    setActive(true);

    const IntervalRef = setInterval(() => {
      timer--;

      if (timer === 0) {
        setActive(false);
        endAlert()
        clearInterval(IntervalRef)
      }
    }, 1000);
  };

  useEffect(() => {
    handleAlert();
  }, []);

  return <>{active ? <p style={{color: "red", textAlign: "center", margin: "5px 0 0 0"}}>{text}</p> : undefined}</>;
};

export default InputAlert;
