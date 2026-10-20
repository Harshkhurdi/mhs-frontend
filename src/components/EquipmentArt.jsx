// Category illustrations, deliberately not presented as manufacturer product images.
export default function EquipmentArt({ specialty }) {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      className="equipment-art"
      aria-hidden="true"
    >
      <ellipse
        cx="120"
        cy="162"
        rx="75"
        ry="7"
        fill="currentColor"
        opacity=".06"
      />
      {specialty === 'ward-infrastructure' ? (
        <g
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M37 116h169v21H37z" fill="white" />
          <path d="M49 113V82l44 10 29 21M40 103l164 14M48 92l153 20" />
          <path d="M45 124h148M59 138v16m124-16v16M37 116V94m169 43v-23M79 139l18 15h43l18-15" />
          <circle cx="60" cy="157" r="6" fill="white" />
          <circle cx="182" cy="157" r="6" fill="white" />
          <path d="M172 105V67h13v41M177 75h4" />
        </g>
      ) : specialty === 'radiology' ? (
        <g
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="76" y="19" width="87" height="64" rx="6" fill="white" />
          <path d="M84 27h71v47H84z" fill="currentColor" opacity=".12" />
          <path d="M99 65l23-29 20 29z" opacity=".6" />
          <path d="M118 84v16m-41 0h84l10 20H66z" fill="white" />
          <path d="M75 121v27h87v-27m-44 28v11m-33 0h67M160 100c40-55 36 25 19 31" />
          <circle cx="80" cy="160" r="5" fill="white" />
          <circle cx="155" cy="160" r="5" fill="white" />
          <path d="M89 109h3m9 0h3m9 0h3m9 0h3m9 0h3" />
        </g>
      ) : (
        <g
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="61" y="29" width="118" height="82" rx="8" fill="white" />
          <rect
            x="71"
            y="39"
            width="90"
            height="57"
            rx="3"
            fill="currentColor"
            opacity=".1"
          />
          <path d="M80 70h14l8-14 11 28 10-39 9 25h20" />
          <circle cx="169" cy="91" r="3" />
          <path d="M105 113v34m30-34v34m-54 10 39-13 39 13" />
          <circle cx="81" cy="157" r="5" fill="white" />
          <circle cx="159" cy="157" r="5" fill="white" />
          {specialty === 'critical-care' && (
            <>
              <path d="M177 74c31-6 30 53 13 50-12-2 6-24-3-29" />
              <path d="M67 118h90v17H67z" fill="white" />
            </>
          )}
        </g>
      )}
    </svg>
  )
}
