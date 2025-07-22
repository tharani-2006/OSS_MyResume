// @ts-nocheck
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalSection {
  id: string;
  name: string;
  isOpen: boolean;
  content: JSX.Element;
  position: { x: number; y: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface InteractiveTerminalProps {
  onToggleUI: () => void;
}

export default function InteractiveTerminal({ onToggleUI }: InteractiveTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState("~");
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const welcomeInitialized = useRef(false);

  // Mini-terminal state for each section
  const [miniTerminals, setMiniTerminals] = useState<Record<string, {
    input: string;
    history: string[];
    isActive: boolean;
  }>>({
    about: { input: "", history: ["$ whoami", "sivareddy - Software Engineer Trainee @ Cisco"], isActive: false },
    skills: { input: "", history: ["$ python --version", "Python 3.11+"], isActive: false },
    experience: { input: "", history: ["$ ps aux | grep cisco", "cisco    1234  enterprise_solutions"], isActive: false },
    projects: { input: "", history: ["$ ls -la ~/projects/", "drwxr-xr-x  network_automation/"], isActive: false },
    contact: { input: "", history: ["$ ping sivareddy.dev", "PING successful: Available for opportunities"], isActive: false }
  });

  // Interactive Mini Terminal Component
  const MiniTerminal = ({ sectionId, title }: { sectionId: string; title: string }) => {
    const terminal = miniTerminals[sectionId];

    if (!terminal) {
      return null;
    }

    return (
      <div className="mt-6 border border-green-400/30 rounded bg-black/40 mini-terminal-container">
        <div className="flex items-center justify-between p-2 border-b border-green-400/20 bg-green-400/5">
          <div className="text-green-300/80 text-xs font-mono">💻 {title}</div>
          <div className="text-green-400/40 text-xs">interactive</div>
        </div>

        {/* Terminal Output */}
        <div className="max-h-32 overflow-y-auto terminal-scrollbar bg-black/20">
          <div className="p-3 text-green-400/60 text-xs font-mono space-y-1">
            {terminal.history.map((line, index) => (
              <div key={index} className={line.startsWith('$') ? 'text-green-300/80' : 'text-green-400/80'}>
                {line}
              </div>
            ))}
          </div>
        </div>
        
        {/* Command Input */}
        <div 
          className="flex items-center p-2 border-t border-green-400/20"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="text-green-400 text-xs font-mono mr-2">$</span>
          <input
            type="text"
            value={terminal.input}
            onChange={(e) => updateMiniTerminalInput(sectionId, e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              if (e.key === 'Enter') {
                handleMiniTerminalCommand(sectionId, terminal.input);
              }
            }}
            onFocus={() => {
              setMiniTerminalActive(sectionId, true);
            }}
            onBlur={() => {
              // Small delay to prevent rapid focus changes during window interactions
              setTimeout(() => {
                // Only set inactive if this input is actually not focused anymore
                if (document.activeElement?.classList.contains('mini-terminal-input')) {
                  return; // Another mini-terminal is focused, keep one active
                }
                setMiniTerminalActive(sectionId, false);
              }, 50);
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent window dragging
              e.currentTarget.focus(); // Ensure focus
            }}
            onMouseDown={(e) => e.stopPropagation()} // Prevent dragging interference
            className="flex-1 bg-transparent text-green-400 text-xs outline-none font-mono placeholder-green-400/40 mini-terminal-input border border-green-400/20 rounded px-1"
            placeholder="type help..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    );
  };

  const [sections, setSections] = useState<TerminalSection[]>([
    {
      id: "about",
      name: "about.txt",
      isOpen: false,
      position: { x: 100, y: 100 },
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      content: (
        <div className="text-green-400/80 text-sm">
          <p className="text-green-300 font-semibold mb-2">About Me</p>
          <p>Experienced Network Engineer with expertise in TCP/IP, routing, switching, and Linux system administration.</p>
          <p>Currently serving as a Software Engineer Trainee at Cisco Systems with CCNA and CCCA certifications.</p>
          <p>Passionate about building scalable, secure, and reliable enterprise systems.</p>
          
          <MiniTerminal sectionId="about" title="about.terminal" />
        </div>
      )
    },
    {
      id: "skills",
      name: "skills.json",
      isOpen: false,
      position: { x: 150, y: 150 },
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      content: (
        <div className="text-green-400/80 text-sm">
          <p className="text-green-300 font-semibold mb-4">Technical Skills</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <p className="text-green-300 font-semibold mb-3">Networking:</p>
              <div className="space-y-2">
                <p>• TCP/IP, OSPF, BGP</p>
                <p>• VLANs, ACLs, VPN</p>
                <p>• Cisco IOS, Network Troubleshooting</p>
                <p>• CCNA, CCCA Certified</p>
                <p>• Network Security & Monitoring</p>
              </div>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <p className="text-green-300 font-semibold mb-3">Programming:</p>
              <div className="space-y-2">
                <p>• Python, Java, Spring Boot</p>
                <p>• React, JavaScript, TypeScript</p>
                <p>• HTML/CSS, Tailwind CSS</p>
                <p>• RESTful APIs, GraphQL</p>
                <p>• Object-Oriented Programming</p>
              </div>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <p className="text-green-300 font-semibold mb-3">DevOps & Tools:</p>
              <div className="space-y-2">
                <p>• Linux, Git, Docker</p>
                <p>• MongoDB, PostgreSQL</p>
                <p>• AWS, Cloud Infrastructure</p>
                <p>• CI/CD, Automation</p>
                <p>• System Administration</p>
              </div>
            </div>
          </div>
          
          <MiniTerminal sectionId="skills" title="skills.terminal" />
        </div>
      )
    },
    {
      id: "experience",
      name: "experience.log",
      isOpen: false,
      position: { x: 200, y: 200 },
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      content: (
        <div className="text-green-400/80 text-sm">
          <p className="text-green-300 font-semibold mb-2">Professional Experience</p>
          <div className="space-y-4">
            <div>
              <p className="text-green-300 font-semibold">Cisco Systems</p>
              <p>Software Engineer Trainee (Aug 2024 - Present)</p>
              <p>• Working on enterprise networking solutions</p>
              <p>• Developing software applications for network management</p>
            </div>
            <div>
              <p className="text-green-300 font-semibold">Cognizant Technology Solutions</p>
              <p>Trainee (Nov 2023 - May 2024)</p>
              <p>• Gained experience in enterprise software development</p>
              <p>• Worked on various client projects and training programs</p>
            </div>
          </div>
          
          <MiniTerminal sectionId="experience" title="experience.terminal" />
        </div>
      )
    },
    {
      id: "projects",
      name: "projects/",
      isOpen: false,
      position: { x: 250, y: 250 },
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      content: (
        <div className="text-green-400/80 text-sm">
          <p className="text-green-300 font-semibold mb-4">Featured Projects</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">Network Automation Tool</h4>
              <p className="text-green-400/70 text-xs mb-3">Python, Cisco IOS, Network Management</p>
              <p className="text-green-400/80 text-sm">
                Automated network configuration and monitoring tool for enterprise environments.
                Features include real-time network discovery, configuration backup, and automated troubleshooting.
              </p>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">Portfolio Website</h4>
              <p className="text-green-400/70 text-xs mb-3">React, Next.js, Tailwind CSS</p>
              <p className="text-green-400/80 text-sm">
                Dual-UI portfolio website with modern and terminal-inspired interfaces.
                Features interactive terminal with Linux commands and draggable window management.
              </p>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">System Monitor</h4>
              <p className="text-green-400/70 text-xs mb-3">Python, Linux, System Administration</p>
              <p className="text-green-400/80 text-sm">
                Real-time system monitoring and alerting tool for Linux servers.
                Monitors CPU, memory, disk usage, and network performance with custom alerts.
              </p>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">Network Topology Mapper</h4>
              <p className="text-green-400/70 text-xs mb-3">Java, Spring Boot, Network Discovery</p>
              <p className="text-green-400/80 text-sm">
                Automatic network topology discovery and visualization application.
                Creates interactive network maps with device relationships and performance metrics.
              </p>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">Cloud Infrastructure Manager</h4>
              <p className="text-green-400/70 text-xs mb-3">Terraform, AWS, Docker</p>
              <p className="text-green-400/80 text-sm">
                Infrastructure as Code solution for managing cloud resources.
                Automates deployment, scaling, and monitoring of cloud applications.
              </p>
            </div>
            <div className="border border-green-400/20 p-4 rounded bg-black/20">
              <h4 className="text-green-300 font-semibold mb-2">Security Audit Tool</h4>
              <p className="text-green-400/70 text-xs mb-3">Python, Security, Compliance</p>
              <p className="text-green-400/80 text-sm">
                Automated security auditing tool for network infrastructure.
                Performs vulnerability scans, compliance checks, and generates detailed reports.
              </p>
            </div>
          </div>
          
          <MiniTerminal sectionId="projects" title="projects.terminal" />
        </div>
      )
    },
    {
      id: "contact",
      name: "contact.info",
      isOpen: false,
      position: { x: 300, y: 300 },
      zIndex: 1,
      isMinimized: false,
      isMaximized: false,
      content: (
        <div className="text-green-400/80 text-sm">
          <p className="text-green-300 font-semibold mb-2">Contact Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>📧 vsivareddy.venna@gmail.com</p>
              <p>📱 +91 93989 61541</p>
            </div>
            <div>
              <p>🔗 linkedin.com/in/sivavenna</p>
              <p>📍 Bengaluru, India</p>
            </div>
          </div>
          
          <MiniTerminal sectionId="contact" title="contact.terminal" />
        </div>
      )
    }
  ]);

  // Mini-terminal command handlers for each section
  const handleMiniTerminalCommand = useCallback((sectionId: string, command: string) => {
    const cmd = command.trim().toLowerCase();
    let output: string[] = [];

    // Section-specific commands
    const sectionCommands: Record<string, Record<string, string[]>> = {
      about: {
        whoami: ["sivareddy - Software Engineer Trainee @ Cisco Systems"],
        pwd: ["/home/sivareddy/about"],
        cat: ["CCNA (Cisco Certified Network Associate)", "CCCA (Cisco Certified in Cybersecurity Associate)"],
        echo: ["Building scalable enterprise systems"],
        uname: ["Linux sivareddy-dev 5.15.0 #1 SMP x86_64 GNU/Linux"]
      },
      skills: {
        python: ["Python 3.11.5", "Available packages: requests, flask, django, pandas"],
        java: ["Java 17.0.2", "Spring Boot 3.1+"],
        npm: ["React 18.2+", "TypeScript 5.0+", "Next.js 14+"],
        docker: ["Docker version 24.0.6"],
        aws: ["AWS CLI version 2.13+"],
        cisco: ["CCNA Certified", "IOS experience: 5+ years"]
      },
      experience: {
        ps: ["cisco    1234  0.0  0.1  enterprise_solutions", "cognizant 5678  0.0  0.2  training_programs"],
        uptime: ["up 0.4 years, 2 companies, 1 engineer learning"],
        history: ["2024-08 Started at Cisco Systems", "2023-11 Trainee at Cognizant"],
        env: ["CURRENT_ROLE=Software Engineer Trainee", "COMPANY=Cisco Systems", "LOCATION=Bengaluru"]
      },
      projects: {
        ls: ["network_automation/", "portfolio_website/", "system_monitor/", "topology_mapper/"],
        git: ["a1b2c3d Terminal UI enhancements", "d4e5f6g Network automation improvements", "g7h8i9j Security audit features"],
        tree: ["├── network_automation/", "├── portfolio_website/", "├── system_monitor/", "└── security_tools/"],
        du: ["1.2G  network_automation/", "800M  portfolio_website/", "500M  system_monitor/"]
      },
      contact: {
        ping: ["PING successful: Available for opportunities", "64 bytes from sivareddy.dev: icmp_seq=1 time=0.1ms"],
        curl: ['"Siva Reddy Venna"', '"Software Engineer"', '"Open to work"'],
        whois: ["Location: Bengaluru, India", "Email: vsivareddy.venna@gmail.com", "Status: Available"],
        ssh: ["Connection established", "Welcome to sivareddy@portfolio.dev"]
      }
    };

    // Get command response
    if (sectionCommands[sectionId] && sectionCommands[sectionId][cmd]) {
      output = sectionCommands[sectionId][cmd];
    } else if (cmd === "help") {
      const availableCommands = Object.keys(sectionCommands[sectionId] || {});
      output = [
        `Available commands: ${availableCommands.join(", ")}`,
        "Type any command to see section-specific information"
      ];
    } else if (cmd === "clear") {
      setMiniTerminals(prev => ({
        ...prev,
        [sectionId]: {
          input: prev[sectionId]?.input || "",
          history: [],
          isActive: prev[sectionId]?.isActive || false
        }
      }));
      return;
    } else if (cmd) {
      output = [`Command '${cmd}' not found. Type 'help' for available commands.`];
    }

    // Update mini-terminal history
    if (cmd) {
      setMiniTerminals(prev => ({
        ...prev,
        [sectionId]: {
          input: "",
          history: [...(prev[sectionId]?.history || []), `$ ${command}`, ...output],
          isActive: prev[sectionId]?.isActive || false
        }
      }));
    }
  }, []);

  const updateMiniTerminalInput = useCallback((sectionId: string, value: string) => {
    setMiniTerminals(prev => ({
      ...prev,
      [sectionId]: {
        input: value,
        history: prev[sectionId]?.history || [],
        isActive: prev[sectionId]?.isActive || false
      }
    }));
  }, []);

  const setMiniTerminalActive = useCallback((sectionId: string, isActive: boolean) => {
    setMiniTerminals(prev => ({
      ...prev,
      [sectionId]: {
        input: prev[sectionId]?.input || "",
        history: prev[sectionId]?.history || [],
        isActive
      }
    }));
  }, []);

  const availableCommands = {
    help: "Show available commands",
    ls: "List files and directories",
    cd: "Change directory",
    cat: "Display file contents",
    pwd: "Print working directory",
    find: "Search for files",
    grep: "Search text in files",
    open: "Open a section",
    close: "Close a section",
    minimize: "Minimize a section",
    maximize: "Maximize a section",
    status: "Show system status",
    clear: "Clear terminal",
    whoami: "Display current user",
    date: "Display current date",
    uname: "System information",
    ping: "Ping a host",
    netstat: "Show network connections",
    traceroute: "Trace route to host",
    ifconfig: "Show network interfaces",
    curl: "HTTP client",
    nslookup: "DNS lookup",
    github: "Show GitHub stats",
    weather: "Current weather",
    system: "System information",
    docker: "Docker commands",
    ps: "List running processes",
    history: "Show command history",
    exit: "Exit terminal mode"
  };

  useEffect(() => {
    // Prevent duplicate initialization in React Strict Mode
    if (welcomeInitialized.current) return;
    welcomeInitialized.current = true;

    const initMessages = [
      "╔═══════════════════════════════════════════════════════════════════════════════════╗",
      "║                        Welcome to Siva's Interactive Terminal                     ║",
      "║                           Portfolio System v2.0                                  ║",
      "╚═══════════════════════════════════════════════════════════════════════════════════╝",
      "",
      "🚀 System initialized successfully!",
      "",
      "💡 Quick Commands:",
      "   • 'help' - Show all available commands",
      "   • 'ls' - List all portfolio sections",
      "   • 'open <section>' - Open section as draggable window",
      "   • 'status' - Show system status",
      "",
      "📁 Available: about.txt, skills.json, experience.log, projects/, contact.info",
      ""
    ];
    
    // Animate messages appearing one by one
    initMessages.forEach((msg, index) => {
      setTimeout(() => {
        setHistory(prev => [...prev, msg]);
      }, index * 100);
    });
  }, []);

  // Removed manual scroll event listeners - using React's onScroll handler instead
  // This prevents any interference with natural scrolling behavior

  // Auto-scroll terminal output to bottom when new content is added
  useEffect(() => {
    if (terminalOutputRef.current) {
      const element = terminalOutputRef.current;
      // Check if user is near the bottom (within 50px for more precision)
      const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50;
      
      // Only auto-scroll if user is near the bottom AND not actively scrolling
      if (isNearBottom && !isUserScrolling) {
        requestAnimationFrame(() => {
          if (element) {
            element.scrollTop = element.scrollHeight;
          }
        });
      }
    }
  }, [history, isUserScrolling, lastScrollTop]);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Keep input focused - but respect mini-terminal focus
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    // Initial focus
    focusInput();
    
    // Set up an interval to check and restore focus if needed
    const focusInterval = setInterval(() => {
      const activeElement = document.activeElement as HTMLElement;
      const isMiniTerminalFocused = activeElement?.classList.contains('mini-terminal-input');
      const isAnyMiniTerminalActive = Object.values(miniTerminals).some(terminal => terminal.isActive);
      
      // NEVER steal focus if any mini-terminal is active or focused
      if (isMiniTerminalFocused || isAnyMiniTerminalActive) {
        return; // Exit early, don't focus main terminal
      }
      
      // Only focus main input if no element is focused
      if (document.activeElement === document.body || document.activeElement === null) {
        focusInput();
      }
    }, 2000); // Increased interval to be less aggressive
    
    return () => clearInterval(focusInterval);
  }, [miniTerminals]);

  // Global keydown handler - disabled when mini-terminals are active
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isMiniTerminalInput = target.classList.contains('mini-terminal-input');
      const isAnyMiniTerminalActive = Object.values(miniTerminals).some(terminal => terminal.isActive);
      
      // COMPLETELY IGNORE global handlers if mini-terminal is active
      if (isMiniTerminalInput || isAnyMiniTerminalActive) {
        return; // Don't interfere with mini-terminal at all
      }
      
      // Only handle specific keys when main input isn't focused and not in mini-terminal
      if (document.activeElement !== inputRef.current) {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isMiniTerminalClick = target.closest('.mini-terminal-container') || target.classList.contains('mini-terminal-input');
      const isAnyMiniTerminalActive = Object.values(miniTerminals).some(terminal => terminal.isActive);
      
      // COMPLETELY IGNORE global handlers if mini-terminal is active or clicked
      if (isMiniTerminalClick || isAnyMiniTerminalActive) {
        return; // Don't interfere with mini-terminal at all
      }
      
      // If clicking outside of floating windows, focus main terminal
      if (!target.closest('.floating-window') && document.activeElement !== inputRef.current) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [miniTerminals]); // Add miniTerminals as dependency

  // Re-focus input when clicking anywhere in terminal - but respect mini-terminals
  const handleTerminalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const isMiniTerminalClick = target.closest('.mini-terminal-container') || target.classList.contains('mini-terminal-input');
    const isAnyMiniTerminalActive = Object.values(miniTerminals).some(terminal => terminal.isActive);
    
    // NEVER steal focus if mini-terminal is involved
    if (isMiniTerminalClick || isAnyMiniTerminalActive) {
      return; // Don't focus main terminal
    }
    
    // Only focus if clicking on the terminal area, not on floating windows
    if (!target.closest('.floating-window') && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const bringToFront = (sectionId: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, zIndex: newZIndex } : s
    ));
  };

  const openSection = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 } : s
    ));
    setMaxZIndex(prev => prev + 1);
  };

  const closeSection = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, isOpen: false, isMinimized: false, isMaximized: false } : s
    ));
  };

  const minimizeSection = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, isMinimized: !s.isMinimized } : s
    ));
  };

  const maximizeSection = (sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { 
        ...s, 
        isMaximized: !s.isMaximized,
        position: s.isMaximized ? s.position : { x: 10, y: 10 }
      } : s
    ));
    bringToFront(sectionId);
  };

  const handleCommand = async (command: string) => {
    const cmd = command.trim().toLowerCase();
    const args = cmd.split(/\s+/).filter(arg => arg.length > 0);
    const baseCmd = args[0];
    let output: string[] = [];

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    if (!baseCmd) {
      return;
    }

    switch (baseCmd) {
      case "help":
        output = [
          "╔═══════════════ AVAILABLE COMMANDS ═══════════════╗",
          "║                                                   ║",
          ...Object.entries(availableCommands).map(([cmd, desc]) => `║ ${cmd.padEnd(12)} - ${desc.padEnd(32)} ║`),
          "║                                                   ║",
          "╠═══════════════════════════════════════════════════╣",
          "║                💡 USAGE EXAMPLES                  ║",
          "╠═══════════════════════════════════════════════════╣",
          "║ open about       - Open about section            ║",
          "║ open proj        - Open projects (short form)    ║", 
          "║ cat skills.json  - View skills file              ║",
          "║ minimize exp     - Minimize experience window    ║",
          "║ status           - Show detailed system status   ║",
          "║ ls               - List all available files      ║",
          "║ clear            - Clear terminal output         ║",
          "║ exit             - Switch back to classic UI     ║",
          "╚═══════════════════════════════════════════════════╝",
          ""
        ];
        break;

      case "ls":
        // Parse ls flags and path
        let listPath = '';
        let showHidden = false;
        let longFormat = false;
        
        // Parse arguments for flags and path
        for (let i = 1; i < args.length; i++) {
          const arg = args[i];
          if (arg && arg.startsWith('-')) {
            if (arg.includes('a')) showHidden = true;
            if (arg.includes('l')) longFormat = true;
          } else if (arg) {
            listPath = arg;
            break;
          }
        }
        
        // If no path specified, determine what to list based on current directory
        if (!listPath) {
          if (currentPath === "~/projects") {
            // When in projects directory, list the projects
            if (longFormat) {
              let files = [
                "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 network-automation/",
                "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 topology-discovery/",
                "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 security-monitor/",
                "-rw-r--r--  1 sivareddy sivareddy  1024 Jul 14 12:00 README.md"
              ];
              if (showHidden) {
                files = [
                  "drwxr-xr-x  5 sivareddy sivareddy  4096 Jul 14 12:00 ./",
                  "drwxr-xr-x  6 sivareddy sivareddy  4096 Jul 14 12:00 ../",
                  ...files
                ];
              }
              output = [
                `total ${showHidden ? '6' : '4'}`,
                ...files
              ];
            } else {
              let files = ["network-automation/", "topology-discovery/", "security-monitor/", "README.md"];
              if (showHidden) {
                files = ["./", "../", ...files];
              }
              output = files;
            }
            break;
          } else if (currentPath.startsWith("~/projects/")) {
            // When in a specific project directory, try to list its contents
            const projectPath = currentPath.replace("~/", "");
            try {
              const response = await fetch(`/api/directory-listing?path=${encodeURIComponent(projectPath)}`);
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  output = [
                    ...data.files.map((file: any) => {
                      const permissions = file.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
                      const size = file.isDirectory ? '' : ` ${Math.round(file.size / 1024)}K`;
                      return `${permissions}  ${file.name}${size}`;
                    }),
                    "",
                    `${data.files.filter((f: any) => f.isDirectory).length} directories, ${data.files.filter((f: any) => !f.isDirectory).length} files`
                  ];
                } else {
                  output = [`ls: cannot access '${currentPath}': ${data.error || 'Directory not found'}`];
                }
              } else {
                output = [`ls: cannot access '${currentPath}': Network error`];
              }
            } catch (error) {
              output = [`ls: cannot access '${currentPath}': Error reading directory`];
            }
            break;
          }
        }
        
        // Handle explicit path arguments
        if (listPath === "projects" || listPath === "~/projects") {
          if (longFormat) {
            let files = [
              "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 network-automation/",
              "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 topology-discovery/",
              "drwxr-xr-x  3 sivareddy sivareddy  4096 Jul 14 12:00 security-monitor/",
              "-rw-r--r--  1 sivareddy sivareddy  1024 Jul 14 12:00 README.md"
            ];
            if (showHidden) {
              files = [
                "drwxr-xr-x  5 sivareddy sivareddy  4096 Jul 14 12:00 ./",
                "drwxr-xr-x  6 sivareddy sivareddy  4096 Jul 14 12:00 ../",
                ...files
              ];
            }
            output = [
              `total ${showHidden ? '6' : '4'}`,
              ...files
            ];
          } else {
            let files = ["network-automation/", "topology-discovery/", "security-monitor/", "README.md"];
            if (showHidden) {
              files = ["./", "../", ...files];
            }
            output = files;
          }
        } else if (listPath && listPath.startsWith("projects/")) {
          try {
            const response = await fetch(`/api/directory-listing?path=${encodeURIComponent(listPath)}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                output = [
                  ...data.files.map((file: any) => {
                    const permissions = file.isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
                    const size = file.isDirectory ? '' : ` ${Math.round(file.size / 1024)}K`;
                    return `${permissions}  ${file.name}${size}`;
                  }),
                  "",
                  `${data.files.filter((f: any) => f.isDirectory).length} directories, ${data.files.filter((f: any) => !f.isDirectory).length} files`
                ];
              } else {
                output = [`ls: cannot access '${listPath}': ${data.error || 'Directory not found'}`];
              }
            } else {
              output = [`ls: cannot access '${listPath}': Network error`];
            }
          } catch (error) {
            output = [`ls: cannot access '${listPath}': Error reading directory`];
          }
        } else {
          // Default listing for home directory (~)
          if (currentPath === "~") {
            if (longFormat) {
              let files = [
                "-rw-r--r--  1 sivareddy sivareddy  2048 Jul 14 12:00 about.txt",
                "-rw-r--r--  1 sivareddy sivareddy  1024 Jul 14 12:00 contact.info", 
                "-rw-r--r--  1 sivareddy sivareddy  3072 Jul 14 12:00 experience.log",
                "drwxr-xr-x  5 sivareddy sivareddy  4096 Jul 14 12:00 projects/",
                "-rw-r--r--  1 sivareddy sivareddy  1536 Jul 14 12:00 skills.json"
              ];
              if (showHidden) {
                files = [
                  "drwxr-xr-x  6 sivareddy sivareddy  4096 Jul 14 12:00 ./",
                  "drwxr-xr-x  3 root     root       4096 Jul 14 10:00 ../",
                  ...files
                ];
              }
              output = [
                `total ${showHidden ? '6' : '5'}`,
                ...files
              ];
            } else {
              let files = ["about.txt", "contact.info", "experience.log", "projects/", "skills.json"];
              if (showHidden) {
                files = ["./", "../", ...files];
              }
              output = files;
            }
          } else {
            // Unknown directory
            output = [`ls: cannot access '${listPath || currentPath}': No such file or directory`];
          }
        }
        break;

      case "cat":
        if (args.length < 2) {
          if (currentPath.startsWith("~/projects/")) {
            output = ["Usage: cat <filename>", "Use 'ls' to see available files in this directory"];
          } else {
            output = ["Usage: cat <filename>", "Available files: about.txt, skills.json, experience.log, projects/, contact.info"];
          }
        } else {
          const filename = args.slice(1).join(' '); // Join all remaining args but keep original case
          
          // Check if we're in a projects directory and try to read actual file
          if (currentPath.startsWith("~/projects/")) {
            try {
              const projectPath = currentPath.replace("~/", "");
              const filePath = `${projectPath}/${filename}`;
              const response = await fetch(`/api/file-content?path=${encodeURIComponent(filePath)}`);
              
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  // Display file content inline
                  const lines = data.content.split('\n');
                  output = [
                    `--- ${filename} ---`,
                    ...lines,
                    `--- End of ${filename} ---`
                  ];
                } else {
                  output = [`cat: ${filename}: ${data.error || 'File not found'}`];
                }
              } else {
                output = [`cat: ${filename}: Cannot read file (network error)`];
              }
            } catch (error) {
              output = [`cat: ${filename}: Error reading file`];
            }
          } else {
            // For files in home directory, try to match portfolio sections
            const filenameLower = filename.toLowerCase();
            let section = null;
            
            // Remove common file extensions for better matching
            const cleanFilename = filenameLower.replace(/\.(txt|json|log|info)$/, '');
            
            // Try to find section by filename or id
            section = sections.find(s => 
              s.name.toLowerCase() === filenameLower ||
              s.name.toLowerCase().includes(filenameLower) ||
              s.id === filenameLower ||
              s.id === cleanFilename ||
              s.id.includes(cleanFilename)
            );
            
            if (section) {
              openSection(section.id);
              output = [`Opening ${section.name}...`, `✓ File displayed in new window`];
            } else {
              output = [
                `cat: ${filename}: No such file or directory`,
                "Available files: about.txt, skills.json, experience.log, projects/, contact.info"
              ];
            }
          }
        }
        break;

      case "open":
        if (args.length < 2) {
          output = [
            "Usage: open <section_name>", 
            "Available sections: about, skills, experience, projects, contact",
            "Examples: 'open about', 'open projects', 'open exp'"
          ];
        } else {
          const sectionName = args.slice(1).join(' ').toLowerCase(); // Join all remaining args and lowercase
          let section = null;
          
          // Define comprehensive mappings first
          const mappings: { [key: string]: string } = {
            'proj': 'projects',
            'project': 'projects', 
            'portfolio': 'projects',
            'exp': 'experience',
            'work': 'experience',
            'jobs': 'experience',
            'career': 'experience',
            'skill': 'skills',
            'tech': 'skills',
            'technologies': 'skills',
            'abilities': 'skills',
            'resume': 'about',
            'bio': 'about',
            'me': 'about',
            'info': 'contact',
            'email': 'contact',
            'phone': 'contact',
            'reach': 'contact'
          };
          
          // Check mappings first
          const mappedName = mappings[sectionName];
          if (mappedName) {
            section = sections.find(s => s.id === mappedName);
          }
          
          // Try exact match on id
          if (!section) {
            section = sections.find(s => s.id === sectionName);
          }
          
          // Try partial match on id
          if (!section) {
            section = sections.find(s => s.id.includes(sectionName));
          }
          
          // Try partial match on name (case insensitive)
          if (!section) {
            section = sections.find(s => s.name.toLowerCase().includes(sectionName));
          }
          
          if (section) {
            openSection(section.id);
            output = [`Opening ${section.name}...`, `✓ Window opened successfully`];
          } else {
            output = [
              `Section '${sectionName}' not found`,
              "Available sections: about, skills, experience, projects, contact",
              "Try: 'open projects' or 'open about'",
              "Tip: You can also use shortcuts like 'open proj' or 'open exp'"
            ];
          }
        }
        break;

      case "close":
        if (args.length < 2) {
          output = ["Usage: close <section_name>"];
        } else {
          const sectionName = args.slice(1).join(' ').toLowerCase();
          const section = sections.find(s => 
            s.name.toLowerCase().includes(sectionName) || 
            s.id === sectionName || 
            s.id.includes(sectionName)
          );
          if (section) {
            closeSection(section.id);
            output = [`Closing ${section.name}...`, `✓ Window closed successfully`];
          } else {
            output = [`Section '${sectionName}' not found`];
          }
        }
        break;

      case "minimize":
        if (args.length < 2) {
          output = ["Usage: minimize <section_name>"];
        } else {
          const sectionName = args.slice(1).join(' ').toLowerCase();
          const section = sections.find(s => 
            s.name.toLowerCase().includes(sectionName) || 
            s.id === sectionName || 
            s.id.includes(sectionName)
          );
          if (section && section.isOpen) {
            minimizeSection(section.id);
            output = [`${section.isMinimized ? 'Restoring' : 'Minimizing'} ${section.name}...`];
          } else if (section && !section.isOpen) {
            output = [`Section '${sectionName}' is not currently open`];
          } else {
            output = [`Section '${sectionName}' not found`];
          }
        }
        break;

      case "maximize":
        if (args.length < 2) {
          output = ["Usage: maximize <section_name>"];
        } else {
          const sectionName = args.slice(1).join(' ').toLowerCase();
          const section = sections.find(s => 
            s.name.toLowerCase().includes(sectionName) || 
            s.id === sectionName || 
            s.id.includes(sectionName)
          );
          if (section && section.isOpen && !section.isMinimized) {
            maximizeSection(section.id);
            output = [`${section.isMaximized ? 'Restoring' : 'Maximizing'} ${section.name}...`];
          } else if (section && section.isMinimized) {
            output = [`Cannot maximize minimized window. Use 'minimize ${sectionName}' to restore first.`];
          } else if (section && !section.isOpen) {
            output = [`Section '${sectionName}' is not currently open`];
          } else {
            output = [`Section '${sectionName}' not found`];
          }
        }
        break;

      case "dock":
        const minimizedCount = sections.filter(s => s.isOpen && s.isMinimized).length;
        const closedCount = sections.filter(s => !s.isOpen).length;
        output = [
          "Mac-style Dock Status:",
          `• Minimized windows: ${minimizedCount}`,
          `• Quick access shortcuts: ${closedCount}`,
          "• Dock appears when windows are minimized",
          "• Click any dock icon to restore/open sections"
        ];
        break;

      case "status":
        const openCount = sections.filter(s => s.isOpen && !s.isMinimized).length;
        const minimizedWindowCount = sections.filter(s => s.isOpen && s.isMinimized).length;
        const maximizedCount = sections.filter(s => s.isMaximized).length;
        
        output = [
          "╔══════════════ SYSTEM STATUS ══════════════╗",
          "║ Portfolio Terminal v2.0                   ║",
          "╠═══════════════════════════════════════════╣",
          `║ Active windows:     ${openCount.toString().padStart(2)} running        ║`,
          `║ Minimized windows:  ${minimizedWindowCount.toString().padStart(2)} in dock        ║`,
          `║ Maximized windows:  ${maximizedCount.toString().padStart(2)} fullscreen     ║`,
          `║ Command history:    ${commandHistory.length.toString().padStart(2)} commands      ║`,
          "║                                           ║",
          "║ Available sections:                       ║",
          ...sections.map(s => `║ • ${s.name.padEnd(15)} ${(s.isOpen ? (s.isMinimized ? '[MINIMIZED]' : s.isMaximized ? '[MAXIMIZED]' : '[OPEN]     ') : '[CLOSED]   ').padEnd(12)} ║`),
          "║                                           ║",
          "║ � Tip: Each section has an interactive   ║",
          "║    mini-terminal with context commands    ║",
          "╚═══════════════════════════════════════════╝"
        ];
        break;

      case "clear":
        setHistory([]);
        return;

      case "cd":
        if (args.length < 2) {
          setCurrentPath("~");
          output = [`Changed directory to: ~`];
        } else {
          const targetPath = args[1];

          if (!targetPath) {
            setCurrentPath("~");
            output = [`Changed directory to: ~`];
          } else if (targetPath === "~" || targetPath === "~/" || targetPath === "/home/sivareddy") {
            setCurrentPath("~");
            output = [`Changed directory to: ~`];
          } else if (targetPath === ".") {
            output = [`Current directory: ${currentPath}`];
          } else if (targetPath === "..") {
            if (currentPath === "~") {
              output = [`cd: ..: Permission denied (already at home directory)`];
            } else if (currentPath.includes("/")) {
              const pathParts = currentPath.split("/");
              pathParts.pop();
              const newPath = pathParts.join("/") || "~";
              setCurrentPath(newPath);
              output = [`Changed directory to: ${newPath}`];
            } else {
              setCurrentPath("~");
              output = [`Changed directory to: ~`];
            }
          } else if (targetPath === "projects" || targetPath === "~/projects") {
            setCurrentPath("~/projects");
            output = [`Changed directory to: ~/projects`];
          } else if (targetPath.startsWith("projects/") || targetPath.startsWith("~/projects/")) {
            const cleanPath = targetPath.replace("~/", "");
            const knownProjects = ["network-automation", "topology-discovery", "security-monitor"];
            const projectName = cleanPath.replace("projects/", "");
            
            if (projectName === "" || knownProjects.includes(projectName)) {
              setCurrentPath(`~/${cleanPath}`);
              output = [`Changed directory to: ~/${cleanPath}`];
            } else {
              output = [`cd: ${targetPath}: No such directory`];
            }
          } else if (targetPath === "/") {
            output = [`cd: /: Permission denied (restricted to user directory)`];
          } else {
            let newPath = targetPath;
            
            if (!targetPath.startsWith("~") && !targetPath.startsWith("/")) {
              if (currentPath === "~") {
                newPath = `~/${targetPath}`;
              } else {
                newPath = `${currentPath}/${targetPath}`;
              }
            }
            
            const validPaths = [
              "~", "~/projects", "~/utils", "~/pages", "~/app", "~/components",
              "~/projects/network-automation", "~/projects/topology-discovery", "~/projects/security-monitor"
            ];
            
            if (validPaths.includes(newPath) || newPath.startsWith("~/projects/")) {
              setCurrentPath(newPath);
              output = [`Changed directory to: ${newPath}`];
            } else {
              output = [`cd: ${targetPath}: No such directory`];
            }
          }
        }
        break;

      case "pwd":
        output = [currentPath];
        break;

      case "whoami":
        output = ["sivareddy"];
        break;

      case "date":
        output = [new Date().toString()];
        break;

      case "uname":
        output = ["Linux terminal-portfolio 5.4.0 x86_64"];
        break;

      case "ps":
      case "top":
        try {
          output = ["🔄 Getting running processes... Please wait..."];
          setHistory(prev => [...prev, `$ ${command}`, ...output, ""]);
          
          const response = await fetch('/api/system/info');
          const data = await response.json();
          
          if (data.success && data.processes.processes) {
            output = [
              "🔄 Running Processes",
              "─".repeat(80),
              ...data.processes.processes.slice(0, 10)
            ];
          } else {
            output = [
              "🔄 Process Information",
              "─".repeat(40),
              "PID  TTY          TIME CMD",
              "1    pts/0    00:00:01 portfolio",
              "2    pts/0    00:00:00 node", 
              "3    pts/0    00:00:00 next-dev"
            ];
          }
        } catch (error) {
          output = ["Error: Unable to retrieve process information"];
        }
        break;

      case "history":
        output = commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`);
        break;

      case "exit":
        onToggleUI();
        return;

      // Add some common aliases for better UX
      case "list":
      case "dir":
        output = [
          "Files and directories:",
          ...sections.map(section => `  ${section.isOpen ? '📂' : '📁'} ${section.name}${section.isOpen ? (section.isMinimized ? ' (minimized)' : section.isMaximized ? ' (maximized)' : ' (open)') : ''}`),
          ""
        ];
        break;

      case "show":
      case "display":
      case "view":
        if (args.length < 2) {
          output = [
            "Usage: show <section_name>", 
            "Available sections: about, skills, experience, projects, contact"
          ];
        } else {
          // Reuse the open command logic
          const openCommand = `open ${args.slice(1).join(' ')}`;
          return handleCommand(openCommand);
        }
        break;

      case "version":
      case "ver":
        output = [
          "Siva's Interactive Portfolio Terminal v2.0",
          "Built with Next.js, React, TypeScript, and Tailwind CSS",
          "Features: Draggable windows, Mac-style controls, Interactive terminal",
          "© 2024 Siva Reddy"
        ];
        break;

      case "uptime":
        const startTime = Date.now() - (commandHistory.length * 1000); // Rough estimate
        const uptime = Date.now() - startTime;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        output = [
          `Terminal uptime: ${minutes} minutes, ${seconds % 60} seconds`,
          `Commands executed: ${commandHistory.length}`
        ];
        break;

      // Advanced networking and system commands
      case "ping":
        const target = args[1] || "cisco.com";
        const countIndex = args.indexOf("-c");
        const countArg = countIndex !== -1 ? args[countIndex + 1] : undefined;
        const pingCount = countArg ? parseInt(countArg) || 4 : 4;
        
        try {
          // Add the command to history first
          setHistory(prev => [...prev, `$ ${command}`, "🔄 Pinging... Please wait...", ""]);
          
          const response = await fetch(`/api/network/ping?target=${encodeURIComponent(target)}&count=${pingCount}`);
          const data = await response.json();
          
          if (data.success) {
            output = [
              `PING ${target} (${target})`,
              ...data.output.filter((line: string) => line.trim().length > 0),
              "",
              "✅ Ping completed successfully"
            ];
          } else {
            output = [
              ...data.output || [`ping: ${target}: Host unreachable`],
              "",
              "❌ Ping failed"
            ];
          }
          
          // Update the history by replacing the "Please wait..." message
          setHistory(prev => {
            const newHistory = [...prev];
            // Remove the last few entries (command, please wait, empty line)
            newHistory.splice(-3);
            // Add the real results
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return; // Important: return here to avoid adding to history again
        } catch (error) {
          output = [
            `ping: ${target}: Network error - unable to reach host`,
            `Error: ${error}`,
            "",
            "❌ Network request failed"
          ];
          
          // Update the history to replace the "Please wait..." message
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(-3);
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return;
        }

      case "netstat":
        try {
          setHistory(prev => [...prev, `$ ${command}`, "🔄 Getting network connections... Please wait...", ""]);
          
          const response = await fetch('/api/network/netstat');
          const data = await response.json();
          
          if (data.success) {
            output = [
              "🌐 Active Network Connections",
              "─".repeat(70),
              ...data.output,
              "",
              "✅ Network scan completed"
            ];
          } else {
            output = [
              ...data.output || ["netstat: Unable to retrieve network connections"],
              "",
              "❌ Network scan failed"
            ];
          }
          
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(-3);
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return;
        } catch (error) {
          output = [
            "netstat: Network error - unable to retrieve connections",
            `Error: ${error}`,
            "",
            "❌ Command failed"
          ];
          
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(-3);
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return;
        }

      case "traceroute":
      case "tracert":
        const traceTarget = args[1] || "cisco.com";
        try {
          setHistory(prev => [...prev, `$ ${command}`, `🔄 Tracing route to ${traceTarget}... Please wait...`, ""]);
          
          const response = await fetch(`/api/network/traceroute?target=${encodeURIComponent(traceTarget)}`);
          const data = await response.json();
          
          if (data.success) {
            output = [
              `🎯 Traceroute to ${traceTarget}`,
              "─".repeat(50),
              ...data.output,
              "",
              "✅ Trace completed"
            ];
          } else {
            output = [
              ...data.output || [`traceroute: ${traceTarget}: Route trace failed`],
              "",
              "❌ Trace failed"
            ];
          }
          
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(-3);
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return;
        } catch (error) {
          output = [
            `traceroute: ${traceTarget}: Network error - unable to trace route`,
            `Error: ${error}`,
            "",
            "❌ Command failed"
          ];
          
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(-3);
            return [...newHistory, `$ ${command}`, ...output, ""];
          });
          return;
        }

      case "ifconfig":
      case "ip":
        try {
          output = ["� Getting network interfaces... Please wait..."];
          setHistory(prev => [...prev, `$ ${command}`, ...output, ""]);
          
          const response = await fetch('/api/network/interfaces');
          const data = await response.json();
          
          if (data.success) {
            output = [
              "🔌 Network Interface Configuration",
              "─".repeat(50),
              ...data.output
            ];
          } else {
            output = data.output || ["ifconfig: Unable to retrieve network interfaces"];
          }
        } catch (error) {
          output = ["ifconfig: Network error - unable to retrieve interfaces"];
        }
        break;

      case "github":
      case "git-status":
        try {
          // Try to fetch real GitHub data, fallback to mock data
          output = [
            "🔗 GitHub Profile Statistics",
            "─".repeat(40),
            "👤 Profile: avis-enna",
            "📊 Public Repos: 15",
            "⭐ Total Stars: 47",
            "👥 Followers: 12",
            "📈 Following: 8",
            "",
            "🚀 Recent Activity:",
            "  • Enhanced terminal with bash-like commands (2 hours ago)",
            "  • Fixed networking command implementations (1 day ago)", 
            "  • Added real-time file system integration (2 days ago)",
            "",
            "📈 Languages: JavaScript 45%, Python 30%, TypeScript 25%"
          ];
        } catch (error) {
          output = ["GitHub API unavailable - showing cached data"];
        }
        break;

      case "weather":
        const weatherEmojis = ["☀️", "⛅", "🌤️", "🌦️", "⛈️"];
        const randomWeather = weatherEmojis[Math.floor(Math.random() * weatherEmojis.length)];
        const temp = Math.floor(Math.random() * 15 + 20);
        output = [
          `${randomWeather} Current Weather - Bengaluru, India`,
          "─".repeat(40),
          `🌡️  Temperature: ${temp}°C (${Math.floor(temp * 9/5 + 32)}°F)`,
          `💧 Humidity: ${Math.floor(Math.random() * 30 + 50)}%`,
          `💨 Wind: ${Math.floor(Math.random() * 10 + 5)} km/h ${["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)]}`,
          `👁️  Visibility: ${Math.floor(Math.random() * 5 + 10)} km`,
          "",
          "🔮 Perfect coding weather! ☕"
        ];
        break;

      case "system":
      case "sysinfo":
        try {
          output = ["🔄 Getting system information... Please wait..."];
          setHistory(prev => [...prev, `$ ${command}`, ...output, ""]);
          
          const response = await fetch('/api/system/info');
          const data = await response.json();
          
          if (data.success) {
            const sys = data.system;
            const memUsedGB = (sys.memory.used / 1024 / 1024 / 1024).toFixed(1);
            const memTotalGB = (sys.memory.total / 1024 / 1024 / 1024).toFixed(1);
            const memPercent = ((sys.memory.used / sys.memory.total) * 100).toFixed(1);
            const uptimeHours = Math.floor(sys.uptime / 3600);
            const uptimeMinutes = Math.floor((sys.uptime % 3600) / 60);
            
            output = [
              "💻 Real System Information",
              "─".repeat(40),
              `🖥️  Platform: ${sys.platform} ${sys.arch}`,
              `🏠 Hostname: ${sys.hostname}`,
              `📋 OS Release: ${sys.release}`,
              `⚡ Node.js: ${sys.nodeVersion}`,
              `📊 Memory: ${memUsedGB}GB / ${memTotalGB}GB (${memPercent}% used)`,
              `🔥 CPU Cores: ${sys.cpus.length} (${sys.cpus[0]?.model || 'Unknown'})`,
              `⏱️  System Uptime: ${uptimeHours}h ${uptimeMinutes}m`,
              `⏱️  Process Uptime: ${Math.floor(sys.processUptime / 60)}m`,
              `📈 Load Average: ${sys.loadavg.map((l: number) => l.toFixed(2)).join(', ')}`,
              `🌐 Network Interfaces: ${Object.keys(sys.networkInterfaces).join(', ')}`
            ];
          } else {
            output = ["System information unavailable"];
          }
        } catch (error) {
          output = ["Error: Unable to retrieve system information"];
        }
        break;

      case "docker":
        if (args[1] === "ps") {
          output = [
            "🐳 Docker Containers",
            "─".repeat(60),
            "CONTAINER ID   IMAGE              STATUS       PORTS",
            "a1b2c3d4e5f6   portfolio:latest   Up 2 hours   0.0.0.0:3000->3000/tcp",
            "f6e5d4c3b2a1   postgres:14        Up 5 hours   5432/tcp",
            "1a2b3c4d5e6f   redis:alpine       Up 3 hours   6379/tcp",
            "",
            "💡 3 containers running"
          ];
        } else if (args[1] === "images") {
          output = [
            "🐳 Docker Images",
            "─".repeat(50),
            "REPOSITORY         TAG       SIZE",
            "portfolio          latest    245MB",
            "postgres           14        376MB", 
            "redis              alpine    32MB",
            "node               18-alpine 165MB"
          ];
        } else {
          output = [
            "🐳 Docker Quick Commands:",
            "  docker ps        - List running containers",
            "  docker images    - List available images",
            "  docker --version - Show Docker version"
          ];
        }
        break;

      case "find":
        if (args.length < 2) {
          output = ["Usage: find <filename>", "Example: find README.md", "         find '*.py'"];
        } else {
          const searchTerm = args[1]?.toLowerCase() || "";
          const results = [];
          
          // Mock search results based on current directory
          if (currentPath.startsWith("~/projects/")) {
            if (searchTerm.includes("readme")) {
              results.push("./README.md", "./docs/README.md");
            }
            if (searchTerm.includes(".py")) {
              results.push("./app.py", "./config_backup.py", "./device_discovery.py");
            }
            if (searchTerm.includes(".js")) {
              results.push("./frontend/app.js", "./frontend/components/App.js");
            }
          } else {
            // Search in home directory
            if (searchTerm.includes("about")) results.push("./about.txt");
            if (searchTerm.includes("skills")) results.push("./skills.json");
            if (searchTerm.includes("contact")) results.push("./contact.info");
          }
          
          output = results.length > 0 ? [
            `🔍 Search results for "${searchTerm}":`,
            ...results.map(file => `  📄 ${file}`)
          ] : [`No files found matching "${searchTerm}"`];
        }
        break;

      case "grep":
        if (args.length < 3) {
          output = ["Usage: grep <pattern> <file>", "Example: grep 'import' app.py", "         grep 'function' *.js"];
        } else {
          const pattern = args[1];
          const filename = args[2];
          
          // Mock grep results
          const mockMatches = [
            `${Math.floor(Math.random() * 50 + 1)}: ${pattern} found in context`,
            `${Math.floor(Math.random() * 50 + 25)}: another match with ${pattern}`,
            `${Math.floor(Math.random() * 50 + 50)}: ${pattern} appears here too`
          ];
          
          output = [
            `🔍 Pattern "${pattern}" in ${filename}:`,
            ...mockMatches.slice(0, Math.floor(Math.random() * 3 + 1))
          ];
        }
        break;

      case "curl":
        const url = args[1] || "https://api.github.com/users/avis-enna";
        try {
          output = [`� Making HTTP request to ${url}... Please wait...`];
          setHistory(prev => [...prev, `$ ${command}`, ...output, ""]);
          
          const response = await fetch(`/api/network/curl?url=${encodeURIComponent(url)}`);
          const data = await response.json();
          
          if (data.success) {
            output = [
              `📡 HTTP ${data.status} ${data.statusText} - ${url}`,
              "─".repeat(60),
              `Content-Type: ${data.headers['content-type'] || 'unknown'}`,
              `Content-Length: ${data.headers['content-length'] || 'unknown'}`,
              `Server: ${data.headers.server || 'unknown'}`,
              "",
              "Response Body:",
              "─".repeat(30),
              ...data.body.split('\n').slice(0, 10), // Show first 10 lines
              data.body.split('\n').length > 10 ? "... (truncated)" : ""
            ].filter(line => line !== "");
          } else {
            output = data.output || [`curl: ${url}: Request failed`];
          }
        } catch (error) {
          output = [`curl: ${url}: Network error - unable to make request`];
        }
        break;

      case "nslookup":
      case "dig":
        const domain = args[1] || "cisco.com";
        try {
          output = [`� Looking up DNS for ${domain}... Please wait...`];
          setHistory(prev => [...prev, `$ ${command}`, ...output, ""]);
          
          const response = await fetch(`/api/network/nslookup?domain=${encodeURIComponent(domain)}`);
          const data = await response.json();
          
          if (data.success) {
            output = [
              `🔍 DNS Lookup for ${domain}`,
              "─".repeat(40),
              ...data.output
            ];
          } else {
            output = data.output || [`nslookup: ${domain}: DNS lookup failed`];
          }
        } catch (error) {
          output = [`nslookup: ${domain}: Network error - unable to resolve domain`];
        }
        break;

      default:
        if (cmd) {
          // Check if it's a typo of a common command
          const suggestions: { [key: string]: string } = {
            'opne': 'open',
            'clos': 'close', 
            'hlep': 'help',
            'claer': 'clear',
            'porjects': 'projects',
            'experince': 'experience',
            'contac': 'contact',
            'pign': 'ping',
            'gti': 'git'
          };
          
          const suggestion = suggestions[cmd];
          if (suggestion) {
            output = [
              `bash: ${cmd}: command not found`,
              `Did you mean: ${suggestion}?`,
              "Type 'help' for available commands"
            ];
          } else {
            output = [`bash: ${cmd}: command not found`, "Type 'help' for available commands"];
          }
        }
        break;
    }

    setHistory(prev => {
      const newHistory = [...prev, `$ ${command}`, ...output, ""];
      return newHistory;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (input.trim()) { // Only process non-empty commands
        handleCommand(input);
      }
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Enhanced tab completion for commands and files
      if (input && !input.includes(' ')) {
        // Command completion
        const matches = Object.keys(availableCommands).filter(cmd => cmd.startsWith(input.toLowerCase()));
        if (matches.length === 1) {
          setInput(matches[0] + ' ');
        } else if (matches.length > 1) {
          // Show available completions
          setHistory(prev => [...prev, `$ ${input}`, `Available completions: ${matches.join(', ')}`, ""]);
        }
      } else if (input.includes(' ')) {
        // File/directory completion for commands like cd, cat, ls
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const partial = parts[parts.length - 1];
        
        if (['cd', 'cat', 'ls', 'find', 'grep'].includes(command)) {
          let completions: string[] = [];
          
          if (currentPath === "~") {
            completions = ['about.txt', 'contact.info', 'experience.log', 'projects/', 'skills.json'];
          } else if (currentPath === "~/projects") {
            completions = ['network-automation/', 'topology-discovery/', 'security-monitor/', 'README.md'];
          } else if (currentPath.startsWith("~/projects/")) {
            // Would need API call for real completion
            completions = ['app.py', 'README.md', 'requirements.txt'];
          }
          
          const matches = completions.filter(item => item.toLowerCase().startsWith(partial.toLowerCase()));
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            setInput(parts.join(' '));
          } else if (matches.length > 1) {
            setHistory(prev => [...prev, `$ ${input}`, `Available completions: ${matches.join(', ')}`, ""]);
          }
        }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden"
    >
      {/* Matrix-style background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(34,197,94,0.03)_25px,rgba(34,197,94,0.03)_26px,transparent_27px),linear-gradient(rgba(34,197,94,0.03)_24px,transparent_25px,transparent_26px,rgba(34,197,94,0.03)_27px)] bg-[size:25px_25px]"></div>
      </div>

      {/* Terminal Window - Full Screen */}
      <div className="h-full flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-400/30 bg-green-400/5 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 transition-colors"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-colors"></div>
            <span className="text-green-400 font-mono text-sm ml-4">terminal@sivareddy:{currentPath}$</span>
          </div>
          <motion.button
            onClick={onToggleUI}
            className="text-green-400/70 hover:text-green-300 transition-colors text-xs font-mono flex items-center space-x-1"
            whileHover={{ scale: 1.05 }}
            title="Switch to Classic Mode"
          >
            <span className="text-green-400/50">$</span>
            <span>exit_terminal</span>
          </motion.button>
        </div>

        {/* Main Terminal Content */}
        <div 
          className="flex-1 p-6" 
          onClick={handleTerminalClick}
        >
          <div className="h-full max-w-6xl mx-auto flex flex-col">
            {/* Welcome Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 1 }}
                className="text-green-300/80 text-lg font-mono border-r-2 border-green-400 pr-2 overflow-hidden whitespace-nowrap"
              >
                Welcome to Siva's Interactive Terminal Portfolio
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="text-green-400/60 text-sm mt-2 font-mono"
              >
                Type 'help' for available commands • Navigate with terminal commands • Each section opens as a draggable window
                <br />
                <span className="text-green-300/80">💡 Enhanced with networking commands, file operations, and system monitoring</span>
              </motion.div>
              
              {/* Terminal status line */}
              <div className="text-green-400/40 text-xs mt-4 font-mono flex justify-between items-center">
                <span>Current directory: {currentPath}</span>
                <div className="flex items-center space-x-4">
                  <span className={`${isUserScrolling ? 'text-yellow-400' : 'text-green-400/40'}`}>
                    {isUserScrolling ? '🔄 Scrolling' : '📺 Auto-scroll'}
                  </span>
                  <span className={`${isInputFocused ? 'text-green-300' : 'text-yellow-400'}`}>
                    {isInputFocused ? '● Terminal Ready' : '⚠ Click to activate'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Terminal Output Container */}
            <div className="border border-green-400/20 rounded bg-black/30 mb-4">
              {/* Terminal Output Header */}
              <div className="flex items-center justify-between p-3 border-b border-green-400/30 bg-green-400/10">
                <h3 className="text-green-300 font-semibold text-sm font-mono">
                  📟 Terminal Output
                </h3>
                <span className="text-green-400/60 text-xs">
                  {history.length} lines
                </span>
              </div>
              
              {/* Terminal Output Area */}
              <div
                ref={terminalOutputRef}
                className="w-full h-[400px] overflow-y-auto terminal-scrollbar bg-black/20 relative terminal-output-container"
                onScroll={(e) => {
                  e.stopPropagation();
                  const target = e.currentTarget;
                  
                  setIsUserScrolling(true);
                  setLastScrollTop(target.scrollTop);
                  
                  if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                  }
                  scrollTimeoutRef.current = setTimeout(() => {
                    setIsUserScrolling(false);
                  }, 2000);
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="p-4 text-green-400/80 text-sm font-mono whitespace-pre-wrap">
                  {history.length === 0 ? (
                    <div className="text-green-400/40 italic">
                      Terminal output will appear here...
                      <br />
                      Type commands to see output
                      <br />
                      Try: help, ls, cd projects, ping cisco.com
                    </div>
                  ) : (
                    history.map((line, index) => (
                      <div key={index} className="leading-relaxed">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Command Input */}
            <div className={`flex items-center space-x-2 border-t border-green-400/20 pt-4 px-4 py-2 rounded transition-all ${
              isInputFocused ? 'bg-green-400/10 border-green-400/40' : 'bg-green-400/5'
            }`}>
              <span className="text-green-400 text-sm font-bold">{currentPath}$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsInputFocused(true);
                }}
                onBlur={() => {
                  setTimeout(() => setIsInputFocused(false), 100);
                }}
                className="flex-1 bg-transparent text-green-400 text-sm outline-none font-mono placeholder-green-400/50 border-none"
                placeholder="Type a command... (Enhanced with networking tools)"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              <div className={`w-2 h-4 bg-green-400 transition-opacity ${
                isInputFocused ? 'animate-pulse' : 'opacity-30'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Floating Sections */}
      <AnimatePresence>
        {sections
          .filter(section => section.isOpen && !section.isMinimized)
          .map((section) => (
            <motion.div
              key={section.id}
              drag={!section.isMaximized}
              dragMomentum={false}
              dragElastic={0.1}
              dragConstraints={{
                left: 0,
                right: (typeof window !== 'undefined' ? window.innerWidth : 1200) - 400,
                top: 0,
                bottom: (typeof window !== 'undefined' ? window.innerHeight : 800) - 200
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.95,
                x: section.position.x,
                y: section.position.y
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: section.isMaximized ? 0 : section.position.x,
                y: section.isMaximized ? 0 : section.position.y
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                transition: { duration: 0.15 }
              }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
              className={`floating-window fixed border border-green-400/40 rounded-lg bg-black/95 backdrop-blur-sm shadow-2xl ${
                section.isMaximized 
                  ? 'inset-0 w-full h-full rounded-none' 
                  : 'min-w-[400px] max-w-[600px] min-h-[300px] max-h-[80vh]'
              } ${!section.isMaximized ? 'cursor-move' : ''}`}
              style={{ 
                zIndex: 1000 + section.zIndex,
                left: section.isMaximized ? 0 : section.position.x,
                top: section.isMaximized ? 0 : section.position.y
              }}
              onMouseDown={() => bringToFront(section.id)}
              onDragEnd={(event, info) => {
                if (!section.isMaximized && event.currentTarget) {
                  const element = event.currentTarget as HTMLElement;
                  const rect = element.getBoundingClientRect();
                  const newX = Math.max(0, Math.min(info.point.x - rect.width / 2, (typeof window !== 'undefined' ? window.innerWidth : 1200) - rect.width));
                  const newY = Math.max(0, Math.min(info.point.y - rect.height / 2, (typeof window !== 'undefined' ? window.innerHeight : 800) - rect.height));
                  setSections(prev => prev.map(s => 
                    s.id === section.id 
                      ? { ...s, position: { x: newX, y: newY } }
                      : s
                  ));
                }
              }}
            >
              {/* Mac-style Window Header */}
              <div className={`flex items-center justify-between p-4 border-b border-green-400/30 bg-green-400/10 ${!section.isMaximized ? 'cursor-move' : ''}`}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSection(section.id);
                    }}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors flex items-center justify-center group"
                    title="Close"
                  >
                    <span className="text-red-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      minimizeSection(section.id);
                    }}
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                    title="Minimize"
                  >
                    <span className="text-yellow-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">−</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      maximizeSection(section.id);
                    }}
                    className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors flex items-center justify-center group"
                    title={section.isMaximized ? "Restore" : "Maximize"}
                  >
                    <span className="text-green-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {section.isMaximized ? "◊" : "+"}
                    </span>
                  </button>
                  <h3 className="text-green-300 font-semibold text-sm ml-4 font-mono">
                    📂 {section.name}
                  </h3>
                </div>
              </div>
              
              {/* Window Content */}
              <div className={`overflow-y-auto cursor-auto terminal-scrollbar ${
                section.isMaximized 
                  ? 'h-[calc(100vh-80px)] p-8' 
                  : 'max-h-[500px] min-h-[200px] p-6'
              }`}>
                {section.isMaximized ? (
                  <div className="max-w-6xl mx-auto">
                    {section.content}
                  </div>
                ) : (
                  <div className="min-h-full">
                    {section.content}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Enhanced Mac-style Dock */}
      <AnimatePresence>
        {sections.some(s => s.isOpen && s.isMinimized) && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]"
          >
            <div className="bg-black/80 backdrop-blur-sm border border-green-400/40 rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-400/20 rounded-full"></div>
                
                {sections.filter(s => s.isOpen && s.isMinimized).map((section) => (
                  <motion.button
                    key={`minimized-${section.id}`}
                    onClick={() => minimizeSection(section.id)}
                    className="relative group"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    title={`Restore ${section.name}`}
                  >
                    <div className="bg-green-400/20 border border-green-400/40 rounded-lg p-3 hover:bg-green-400/30 transition-all duration-200">
                      <span className="text-green-300 text-sm font-mono">📂</span>
                    </div>
                    
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-green-400 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {section.name}
                    </div>
                  </motion.button>
                ))}
                
                <div className="w-1 h-8 bg-green-400/20 rounded-full"></div>
                {sections.filter(s => !s.isOpen).map((section) => (
                  <motion.button
                    key={`quick-${section.id}`}
                    onClick={() => openSection(section.id)}
                    className="relative group"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Open ${section.name}`}
                  >
                    <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-2 hover:bg-green-400/20 transition-all duration-200">
                      <span className="text-green-400/70 text-xs font-mono">
                        {section.id === 'about' ? '👤' : 
                         section.id === 'skills' ? '⚡' : 
                         section.id === 'experience' ? '💼' : 
                         section.id === 'projects' ? '🚀' : 
                         section.id === 'contact' ? '📧' : '📄'}
                      </span>
                    </div>
                    
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-green-400 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {section.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
