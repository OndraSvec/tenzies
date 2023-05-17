const Die = ({ holdDie, value, isHeld }) => {
  const dots = [];

  for (let i = 0; i < value; i += 1) dots.push(i);

  const dotSpans = dots.map((dot, index) => (
    <span key={index} className={`dot dots-${value}`}></span>
  ));

  return (
    <div className={`die ${isHeld ? "held" : ""}`} onClick={holdDie}>
      {dotSpans}
    </div>
  );
};

export default Die;
