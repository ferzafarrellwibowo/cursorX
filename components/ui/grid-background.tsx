import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
}

export const GridBackground = ({ className }: GridBackgroundProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-0 pointer-events-none opacity-30",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
};

export default GridBackground;
