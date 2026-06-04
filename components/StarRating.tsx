export default function StarRating({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center" aria-label={value.toFixed(1) + " out of 5"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= full ? "#E0A458" : "none"}
          stroke="#E0A458"
          strokeWidth={1.5}
          className="shrink-0"
        >
          <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}