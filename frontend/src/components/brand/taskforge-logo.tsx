type TaskForgeLogoProps = {
  size?: "small" | "large";
  animated?: boolean;
};

const sizeClasses = {
  small: "h-9 w-9",
  large: "h-64 w-64 sm:h-80 sm:w-80",
};

export default function TaskForgeLogo({
  size = "small",
  animated = false,
}: TaskForgeLogoProps) {
  return (
    <div
      className={[
        "relative inline-flex items-center justify-center",
        sizeClasses[size],
        animated
          ? "animate-logo-float"
          : "transition-transform duration-300 hover:rotate-6 hover:scale-105",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label="TaskForge"
        className="h-full w-full drop-shadow-xl"
      >
        <defs>
          <linearGradient
            id="taskforge-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <filter id="taskforge-glow">
            <feGaussianBlur
              stdDeviation="4"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer shape */}
        <rect
          x="20"
          y="20"
          width="200"
          height="200"
          rx="52"
          fill="url(#taskforge-gradient)"
        />

        {/* Connections */}
        <path
          d="M75 88 L120 65 L165 88 L120 142 Z"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Collaboration nodes */}
        <circle
          cx="75"
          cy="88"
          r="14"
          fill="white"
          className={
            animated
              ? "animate-logo-node-one"
              : ""
          }
        />

        <circle
          cx="120"
          cy="65"
          r="14"
          fill="white"
          className={
            animated
              ? "animate-logo-node-two"
              : ""
          }
        />

        <circle
          cx="165"
          cy="88"
          r="14"
          fill="white"
          className={
            animated
              ? "animate-logo-node-three"
              : ""
          }
        />

        {/* Completed task */}
        <path
          d="M82 145 L108 170 L162 120"
          fill="none"
          stroke="white"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            animated
              ? "animate-logo-check"
              : ""
          }
        />

        {/* Forge spark */}
        <path
          d="M181 45 L186 56 L198 61 L186 66 L181 78 L176 66 L164 61 L176 56 Z"
          fill="#fef08a"
          filter="url(#taskforge-glow)"
          className={
            animated
              ? "animate-logo-spark"
              : ""
          }
        />
      </svg>
    </div>
  );
}