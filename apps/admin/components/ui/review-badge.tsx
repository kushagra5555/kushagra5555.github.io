export function ReviewBadge({ reviewRequired }: { reviewRequired: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        border: "1px solid",
        borderColor: reviewRequired ? "#ff8a65" : "#66bb6a",
        color: reviewRequired ? "#ffab91" : "#a5d6a7"
      }}
    >
      {reviewRequired ? "Review required" : "Confirmed"}
    </span>
  );
}
