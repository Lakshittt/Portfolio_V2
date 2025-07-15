import React, { useRef, useState } from "react";
import {
  MapPin,
  Code,
  Download,
  Github,
  Briefcase,
  Linkedin,
  ScanFace,
} from "lucide-react";

interface IdCardProps {
  cardFlipped: boolean;
  setCardFlipped: (v: boolean) => void;
  isCardHovered: boolean;
  setIsCardHovered: (v: boolean) => void;
  cardRef: React.RefObject<HTMLDivElement>;
}

// The main card component that will be rendered directly (no 3D)
const IdCard: React.FC<IdCardProps> = ({
  cardFlipped,
  setCardFlipped,
  setIsCardHovered,
}) => {
  const [localMousePosition, setLocalMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Update local mouse position when mouse moves over the container
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    // Calculate normalized mouse position from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    setLocalMousePosition((prev) => ({
      x: x * 0.9 + prev.x * 0.1,
      y: y * 0.9 + prev.y * 0.1,
    }));

    // Update light position for glow effect
    updateGlowEffect(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Reset mouse position when mouse leaves
  const handleMouseLeave = () => {
    setLocalMousePosition({ x: 0, y: 0 });
    setIsHovering(false);
    setIsCardHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsCardHovered(true);
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/document/d/11CaRC7FOW375Z4zkGpe2s5m3XN2H2UrRsxL1q_2qVNg/export?format=pdf";
    link.download = "Lakshit_Jain_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("Resume downloaded successfully!");
  };

  // Function to update the glow effect based on mouse position
  const updateGlowEffect = (mouseX: number, mouseY: number) => {
    const currentCard = cardFlipped
      ? backCardRef.current
      : frontCardRef.current;
    if (!currentCard) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Calculate the relative position within the container
    const relativeX = mouseX / containerRect.width;
    const relativeY = mouseY / containerRect.height;

    // Create a radial gradient for the glow effect
    const gradientX = relativeX * 100;
    const gradientY = relativeY * 100;

    // Apply the gradient to the current active card only
    currentCard.style.background = `
      radial-gradient(
        circle at ${gradientX}% ${gradientY}%, 
        rgba(34, 197, 94, 0.15), 
        rgba(17, 24, 39, 0.95) 40%
      ),
      linear-gradient(to bottom right, #1f2937, #111827)
    `;
  };

  // Calculate the rotation styles based on mouse position
  const rotateX = -localMousePosition.y * 5; // degrees
  const rotateY = localMousePosition.x * 5; // degrees

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex w-1/3 p-8 mt-20 items-center justify-center relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        onClick={() => setCardFlipped(!cardFlipped)}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            cardFlipped ? "rotateY(180deg)" : ""
          }`,
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          position: "relative",
          width: "380px",
          height: "500px",
        }}
      >
        {/* Front of the card */}
        <div
          style={{
            backfaceVisibility: "hidden",
            position: "absolute",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={frontCardRef}
            className="rounded-lg shadow-2xl p-6 w-full h-full border border-gray-700 relative overflow-hidden flex flex-col justify-between"
            style={{
              boxShadow:
                isHovering && !cardFlipped
                  ? "0 0 15px 2px rgba(34, 197, 94, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "box-shadow 0.3s ease",
              background: "linear-gradient(to bottom right, #1f2937, #111827)",
            }}
          >
            {/* Card Header */}
            <div className="text-center mb-4">
              <div className="w-36 h-36 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQGl0rw0gDZfkg/profile-displayphoto-shrink_800_800/B56Zb3umD4HcAc-/0/1747912910861?e=1758153600&v=beta&t=xKUQDvEdOhxIFkZRj1HlR6LpAGGowjsmfa5BpNYF_uY"
                  className=" rounded-full object-cover"
                  alt="profile"
                  crossOrigin="anonymous"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">Lakshit Jain</h2>
              <p className="text-green-500 text-sm">Software Developer</p>
            </div>
            {/* Card Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={14} className="text-green-500" />
                <span className="typewriter typewriter-1">
                  Bengaluru, India
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase size={14} className="text-green-500" />
                <span className="typewriter typewriter-2">
                  Frontend Developer{" "}
                  <a
                    href="http://www.myshubhlife.com"
                    target="_blank"
                    className="hover:text-green-500"
                  >
                    @MyShubhLife
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Code size={14} className="text-green-500" />
                <span className="typewriter typewriter-3">
                  React, Node.js, TypeScript
                </span>
              </div>
            </div>
            {/* Social Links */}
            <div className="mt-4 flex items-center justify-center">
              <a
                href="https://github.com/lakshittt"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-green-500 hover:text-green-500 transition-colors"
                aria-label="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={22} />
              </a>
              <a
                href="https://www.linkedin.com/in/lakshittt/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-green-500 hover:text-green-500 transition-colors"
                aria-label="LinkedIn"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={22} />
              </a>
              <a
                href="https://bio.link/lakshittt"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 text-green-500 hover:text-green-500 transition-colors"
                aria-label="LinkedIn"
                onClick={(e) => e.stopPropagation()}
              >
                <ScanFace size={22} />
              </a>
            </div>
            {/* Interactive Buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 relative overflow-hidden bg-gray-700 text-white py-2 px-3 rounded flex items-center justify-center shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-green-600 before:duration-500 before:ease-out hover:shadow-green-600 hover:before:h-96 hover:before:w-96"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadResume();
                }}
              >
                <div className="flex items-center justify-center gap-1 relative z-10">
                  <Download size={12} />
                  Resume
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div
          style={{
            backfaceVisibility: "hidden",
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={backCardRef}
            className="rounded-lg shadow-2xl p-6 w-full h-full border border-gray-700 relative overflow-hidden"
            style={{
              boxShadow:
                isHovering && cardFlipped
                  ? "0 0 15px 2px rgba(34, 197, 94, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "box-shadow 0.3s ease",
              background: "linear-gradient(to bottom right, #1f2937, #111827)",
            }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded p-3">
                <div className="text-green-500 text-sm font-semibold">
                  Projects Completed
                </div>
                <div className="text-white text-2xl font-bold">15+</div>
              </div>
              <div className="bg-gray-700/50 rounded p-3">
                <div className="text-green-500 text-sm font-semibold">
                  Technologies Mastered
                </div>
                <div className="text-white text-2xl font-bold">12+</div>
              </div>
              <div className="bg-gray-700/50 rounded p-3">
                <div className="text-green-500 text-sm font-semibold">
                  CSS Battles Fought
                </div>
                <div className="flex items-center gap-2 text-white text-xl font-bold pt-1">
                  {/* <Github size={20} />  */}
                  Margins vs Padding: 47 rounds. No clear winner.
                </div>
              </div>
              <div className="bg-gray-700/50 rounded p-3">
                <div className="text-green-500 text-sm font-semibold">
                  My AI Co-Pilot's Main Job
                </div>
                <div className="flex items-center gap-2 text-white text-xl font-bold pt-1">
                  {/* <Github size={20} />  */}
                  Hearing "fix this, please."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
