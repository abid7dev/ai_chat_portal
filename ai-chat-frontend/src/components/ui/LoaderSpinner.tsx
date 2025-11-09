interface LoaderSpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  className?: string;
}

export default function LoaderSpinner({
  size = 20,
  color = "border-white",
  thickness = 2,
  className = "",
}: LoaderSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-${thickness} border-t-transparent ${color} ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
      }}
    />
  );
}
