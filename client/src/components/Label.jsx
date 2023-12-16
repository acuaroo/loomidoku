function Label({ label, isRow }) {
  return (
    <div className={`sm:text-2xl text-center ${(isRow) ? "translate-y-[37.5%]" : ""}`}>
      {label}
    </div>
  );
}

export default Label;