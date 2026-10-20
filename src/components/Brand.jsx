export default function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <path
            d="M7 29V11l13 12 13-12v18"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d="M17 9h6M20 6v6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <span>
        <strong>
          medelec<span>.</span>
        </strong>
        <small>HEALTHCARE SOLUTIONS</small>
      </span>
    </span>
  )
}
