interface LotusIconProps {
  className?: string;
}

export function LotusIcon({ className }: LotusIconProps) {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 2 C10 6 6 8 4 10 C8 9 10 11 12 14 C14 11 16 9 20 10 C18 8 14 6 12 2Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M12 14 L12 16 M8 12 L6 14 M16 12 L18 14"
        stroke="currentColor"
        strokeWidth="0.75"
      />
    </svg>
  );
}
