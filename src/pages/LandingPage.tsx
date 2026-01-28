import React, { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { PageTransition } from "@/components/layout/PageTransition";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);
  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border  content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const words = ["GREAT", "STRIKING", "MODERN", "BEAUTIFUL"];

  return (
    <PageTransition className="h-screen w-full rounded-md flex items-center justify-center bg-black antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="p-4 px-6 max-w-7xl mx-auto relative z-10 w-full">
        <h1 className="text-2xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 leading-tight md:leading-tight pb-1">
          Everyone deserves a <br /><ContainerTextFlip words={words} /> Resume.
        </h1>
        <br></br>
        <p className="mt-3 md:mt-4 font-normal text-sm md:text-base text-neutral-300 max-w-lg text-center mx-auto px-2">
          Create stunning, professional resumes in minutes with Resume Flow. Modern templates, easy customization, and ATS-friendly designs.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => navigate("/resume-builder")}
            className="bg-white text-black flex items-center space-x-2 cursor-pointer"
          >
            <AceternityLogo />
            <span>Build now</span>
          </HoverBorderGradient>
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => navigate("/upload")}
            className="bg-black text-white flex items-center space-x-2 cursor-pointer"
          >
            <AceternityLogo />
            <span>Create from existing resume</span>
          </HoverBorderGradient>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-4 text-sm text-neutral-500">
        <Link to="/privacy" className="hover:text-neutral-300 transition-colors">
          Privacy Policy
        </Link>
        <span className="text-neutral-700">•</span>
        <Link to="/terms" className="hover:text-neutral-300 transition-colors">
          Terms of Service
        </Link>
      </div>
    </PageTransition>
  );
}
