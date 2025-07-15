import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  User,
  Code,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
} from "lucide-react";
import Card from "./components/Card";
import Terminal from "./components/Terminal";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [viewCounterImg, setViewCounterImg] = useState<string | null>(null);

  const commands = {
    help: () => (
      <div className="space-y-2">
        <div className="text-green-500 font-bold">Available Commands:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-yellow-400">help</span> - Show this help
            message
          </div>
          <div>
            <span className="text-yellow-400">sudo</span> - about me
          </div>
          <div>
            <span className="text-yellow-400">skills</span> - View my technical
            skills
          </div>
          <div>
            <span className="text-yellow-400">projects</span> - See my projects
          </div>
          <div>
            <span className="text-yellow-400">education</span> - My educational
            background
          </div>
          <div>
            <span className="text-yellow-400">experience</span> - Work
            experience
          </div>
          <div>
            <span className="text-yellow-400">contact</span> - Get in touch
          </div>
          <div>
            <span className="text-yellow-400">social</span> - Social media links
          </div>
          <div>
            <span className="text-yellow-400">clear</span> - Clear the terminal
          </div>
          <div>
            <span className="text-yellow-400">resume</span> - Download my resume
          </div>
        </div>
      </div>
    ),

    sudo: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">About Me...</div>
        <div className="text-gray-300 leading-relaxed">
          <p>
            Hello! I'm Lakshit jain passionate Full Stack Developer with
            expertise in modern web technologies.
          </p>
          {/* <p className="mt-2">
            I love creating elegant solutions to complex problems and building
            applications that make a difference.
          </p>
          <p className="mt-2">
            When I'm not coding, you can find me exploring new technologies,
            contributing to open source, or enjoying a good cup of coffee.
          </p> */}
        </div>
      </div>
    ),

    skills: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">Technical Skills</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-yellow-400 font-semibold mb-2">
              Programming Languages
            </div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Python</div>
              <div>• JavaScript (ES6+)</div>
              <div>• TypeScript</div>
              <div>• SQL</div>
              <div>• Java</div>
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2">Frontend</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• React.js</div>
              <div>• HTML5 / CSS3</div>
              <div>• Tailwind CSS</div>
              <div>• Redux</div>
              <div>• Context API</div>
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2">Backend</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Node.js</div>
              <div>• Express.js</div>
              <div>• Firebase (Firestore, OAuth, MFA)</div>
              <div>• Web Sockets</div>
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2">Databases</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• MongoDB</div>
              <div>• SQL</div>
              <div>• Firebase Realtime DB</div>
              <div>• DBMS</div>
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2">
              Tools & Platforms
            </div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• AWS (EC2, S3, IAM)</div>
              <div>• Git / GitHub</div>
              <div>• Figma</div>
              <div>• VS Code</div>
              <div>• Chrome DevTools</div>
            </div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-2">
              Development Practices
            </div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• RESTful APIs</div>
              <div>• Agile Development</div>
              <div>• Component-Based Architecture</div>
            </div>
          </div>
        </div>
      </div>
    ),

    projects: () => (
      <div className="space-y-4">
        <div className="text-green-500 font-bold">Featured Projects</div>
        <div className="space-y-4 flex flex-col gap-2">
          <a
            href="https://github.com/Lakshittt/CareerFit-AI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border border-gray-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Code size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  CareerFit-AI
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-2">
                Developed an AI-powered job fit assessment tool that evaluates
                resume compatibility with job descriptions using natural
                language processing, providing fit percentage scores and
                actionable improvement suggestions.
              </div>
              <div className="text-xs text-gray-400 mt-4">
                Python • Streamlit • LangChain • Google Gemini AI
              </div>
            </div>
          </a>

          <a
            href="https://github.com/Lakshittt/Shopify-Plus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border border-gray-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TerminalIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  Shopify Plus
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-2">
                Created a Node.js-based application to enhance the e-commerce
                experience, supporting features such as file handling for
                sellers, session management, token-based authentication, and
                automated PDF invoice generation.
              </div>
              <div className="text-xs text-gray-400 mt-4">
                React • Node.js • MongoDB • Express • EJS • JWT
              </div>
            </div>
          </a>

          <a
            href="https://github.com/Lakshittt/PDF-Summarizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border border-gray-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TerminalIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  PDF-Summarizer
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-2">
                PDF Summarizer lets users upload PDFs, select pages, and quickly
                generate concise summaries or answer questions using advanced
                NLP, making it easy to extract key information from documents.
              </div>
              <div className="text-xs text-gray-400 mt-4">
                Python • Streamlit • PyPDF2 • Langchain • Hugging Face
                Transformers • OpenAI API
              </div>
            </div>
          </a>

          <a
            href="https://github.com/Lakshittt/LachooConnect"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border border-gray-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TerminalIcon size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  Lachoo Connect
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-2">
                Lachoo Connect is a React and Firebase-based alumni app for
                Lachoo Memorial College, enabling alumni to connect, network,
                share experiences, and stay updated on each other's professional
                journeys.
              </div>
              <div className="text-xs text-gray-400 mt-4">
                HTML • CSS • JavaScript • Bootstrap • React
              </div>
            </div>
          </a>
        </div>
      </div>
    ),

    education: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">Education</div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                Masters of Computer Application (MCA)
              </span>
            </div>
            <div className="text-gray-300 text-sm">
              VELLORE INSTITUTE OF TECHNOLOGY, VELLORE
            </div>
            <div className="text-gray-400 text-xs">CGPA: 8.68 (2023-2025)</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                Bachelor of Computer Application (BCA)
              </span>
            </div>
            <div className="text-gray-300 text-sm">
              LACHOO MEMORIAL COLLEGE, JODHPUR
            </div>
            <div className="text-gray-400 text-xs">CGPA: 7.8 (2020-2023)</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                Senior Secondary Education (12th Grade)
              </span>
            </div>
            <div className="text-gray-300 text-sm">CBSE • 2018</div>
            <div className="text-gray-400 text-xs">GPA: 92.4%</div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold mb-1">
              Certifications
            </div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• NVIDIA Deep Learning Institute Certificate:</div>
              <div>
                • Career Essentials in Generative AI by Microsoft and LinkedIn:
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    experience: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">Work Experience</div>
        <div className="space-y-4">
          <div>
            <div className="text-yellow-400 font-semibold text-xl">
              Frontend Developer
            </div>
            <div className="text-gray-300 text-md font-semibold my-1">
              Datasigns Technologies Pvt Ltd. (A Ugro Capital Company),
              Bengaluru{" "}
              <span className="font-medium italic text-sm">
                • (July 2024 – Present)
              </span>
            </div>
            {/* <div>
              <MapPin size={16} className="text-yellow-400" />
            </div> */}
            <div className="text-gray-400 text-sm mt-1">
              • Built and maintained scalable business dashboards with modern
              frontend tech, improving data visibility and user engagement.
              <br />
              • Migrated legacy code to functional components, boosting
              performance by 65%.
              <br />
              • Integrated RESTful APIs and optimized state management for
              real-time UI updates.
              <br />
              • Collaborated with product teams to deliver client-focused
              features in an Agile environment.
              <br />• Gained strong fintech domain knowledge to align technical
              solutions with business needs.
            </div>
          </div>
        </div>
      </div>
    ),

    contact: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">Contact Information</div>
        <div className="space-y-2">
          <a href="mailto:lakshitjain.dev@gmail.com">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-yellow-400" />
              <span className="text-gray-300 hover:text-yellow-400">
                lakshitjain.dev@gmail.com
              </span>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <User size={16} className="text-yellow-400" />
            <span className="text-gray-300">+91 9649059594</span>
          </div>
          <div className="text-gray-400 text-sm mt-3">
            Feel free to reach out! I'm always open to discussing new
            opportunities or interesting projects.
          </div>
        </div>
      </div>
    ),

    social: () => (
      <div className="space-y-3">
        <div className="text-green-500 font-bold">Social Links</div>
        <div className="space-y-2">
          <a
            href="https://github.com/lakshittt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github size={16} className="text-yellow-400" />

            {/* <span
              className="text-gray-300 hover:text-yellow-400 transition-all duration-500 bg-gradient-to-r from-yellow-400 to-yellow-400 bg-[length:0%_100%] hover:bg-[length:100%_100%] bg-no-repeat bg-left"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "background-size 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              github.com/lakshittt
            </span> */}

            <span className="text-gray-300">github.com/lakshittt</span>
            <ExternalLink size={12} className="text-gray-500" />
          </a>
          <a
            href="https://linkedin.com/in/lakshittt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Linkedin size={16} className="text-yellow-400" />
            <span className="text-gray-300">linkedin.com/in/lakshittt</span>
            <ExternalLink size={12} className="text-gray-500" />
          </a>
          <a
            href="https://bio.link/lakshittt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <TerminalIcon size={16} className="text-yellow-400" />
            <span className="text-gray-300">bio.link/lakshittt</span>
            <ExternalLink size={12} className="text-gray-500" />
          </a>
        </div>
      </div>
    ),

    resume: () => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href =
          "https://docs.google.com/document/d/11CaRC7FOW375Z4zkGpe2s5m3XN2H2UrRsxL1q_2qVNg/export?format=pdf";
        link.download = "Lakshit_Jain_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1800);

      return (
        <div className="space-y-3">
          <div className="text-green-500 font-bold">Resume</div>
          <div className="text-gray-300 flex items-center gap-2">
            <span>
              Resume download initiated..., Or you can visit here to see the
              resume.
            </span>
            <a
              href="https://docs.google.com/document/d/11CaRC7FOW375Z4zkGpe2s5m3XN2H2UrRsxL1q_2qVNg/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} className="text-gray-500" />
            </a>
          </div>
        </div>
      );
    },

    clear: () => null,
  };

  useEffect(() => {
    const welcomeOutput: CommandOutput = {
      command: "",
      output: (
        <div className="space-y-3">
          <div className="text-green-500 font-bold text-lg">
            Welcome to my Interactive Portfolio Terminal!
          </div>
          <div className="text-gray-300">
            <p>
              Type <span className="text-yellow-400">'help'</span> to see
              available commands.
            </p>
            <p>Use arrow keys to navigate command history.</p>
          </div>
          <div className="text-gray-500 text-sm">
            Last login: {new Date().toLocaleString()}
          </div>
        </div>
      ),
      timestamp: new Date(),
    };
    setHistory([welcomeOutput]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    const img = new Image();
    img.src =
      "https://counter1.optistats.ovh/private/freecounterstat.php?c=4f851adnbs5l59scxty3d43jl8xat2kj";
    img.onload = () => {
      setViewCounterImg(img.src);
    };
  }, [history]);

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!cardRef.current) return;
  //   const rect = cardRef.current.getBoundingClientRect();
  //   const centerX = rect.left + rect.width / 2;
  //   const centerY = rect.top + rect.height / 2;
  //   const mouseX = e.clientX - centerX;
  //   const mouseY = e.clientY - centerY;
  //   setMousePosition({ x: mouseX, y: mouseY });
  // };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    setIsLoading(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const output = commands[trimmedCmd as keyof typeof commands]?.() || (
      <div className="text-red-400">
        Command not found: {cmd}. Type 'help' for available commands.
      </div>
    );

    const newOutput: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newOutput]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen h-screen font-mono flex text-green-500 bg-gradient-to-br from-zinc-800 via-black to-black relative overflow-hidden ">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
      {/* Move the hi div above the overlay and video, and give it a higher z-index */}
      <div className="fixed top-0 left-0 w-full h-20 z-30 flex flex-row justify-between px-6 bg-black bg-opacity-30 backdrop-blur-md">
        <div className="flex flex-col justify-center">
          <p className="text-green-500 text-lg font-bold">Lakshit Jain</p>
          <p className="text-gray-300 text-sm">Software Developer</p>
        </div>

        {viewCounterImg && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-300">Portfolio Views:</span>
            <a href="https://www.freecounterstat.com" title="website counter">
              <img
                width={50}
                height={50}
                src={viewCounterImg}
                title="website counter"
                alt="website counter"
                style={{ display: "none" }}
                onLoad={(e) => (e.currentTarget.style.display = "inline")}
              />
            </a>
          </div>
        )}
      </div>
      <div className="relative z-20 flex w-full">
        <Card
          cardFlipped={cardFlipped}
          setCardFlipped={setCardFlipped}
          isCardHovered={isCardHovered}
          setIsCardHovered={setIsCardHovered}
          cardRef={cardRef}
        />
        {/* <InteractiveCard3D /> */}
        <Terminal
          history={history}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
          terminalRef={terminalRef}
          focusInput={focusInput}
        />
      </div>
    </div>
  );
}

export default App;
