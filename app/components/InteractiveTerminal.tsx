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
        [sectionId]: { ...prev[sectionId], history: [] }
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
          ...prev[sectionId],
          history: [...prev[sectionId].history, `$ ${command}`, ...output],
          input: ""
        }
      }));
    }
  }, []);

  const updateMiniTerminalInput = useCallback((sectionId: string, value: string) => {
    setMiniTerminals(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], input: value }
    }));
  }, []);

  const setMiniTerminalActive = useCallback((sectionId: string, isActive: boolean) => {
    setMiniTerminals(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], isActive }
    }));
  }, []);

  const availableCommands = {
    help: "Show available commands",
    ls: "List files and directories",
    cat: "Display file contents",
    open: "Open a section",
    close: "Close a section",
    minimize: "Minimize a section",
    maximize: "Maximize a section",
    status: "Show system status",
    debug: "Show debug information",
    test: "Test section opening",
    dock: "Show/hide the dock",
    clear: "Clear terminal",
    pwd: "Print working directory",
    whoami: "Display current user",
    date: "Display current date",
    uname: "System information",
    ps: "List running processes",
    top: "Display running processes",
    history: "Show command history",
    spam: "Generate test output (scroll test)",
    fillscreen: "Fill screen with content to test scrolling",
    scrolldebug: "Debug scroll container properties",
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
      "   • 'status' - Show system status and debug info",
      "",
      "� Available: about.txt, skills.json, experience.log, projects/, contact.info",
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
      
      console.log('Auto-scroll check:', {
        isUserScrolling,
        isNearBottom,
        scrollTop: element.scrollTop,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        distanceFromBottom: element.scrollHeight - (element.scrollTop + element.clientHeight),
        lastScrollTop
      });
      
      // Only auto-scroll if user is near the bottom AND not actively scrolling
      // Also check if the user has manually scrolled up (current position < last known bottom)
      if (isNearBottom && !isUserScrolling) {
        console.log('Auto-scrolling to bottom');
        requestAnimationFrame(() => {
          if (element) {
            element.scrollTop = element.scrollHeight;
          }
        });
      } else if (isUserScrolling) {
        console.log('User is scrolling - skipping auto-scroll');
      } else {
        console.log('User is not near bottom - skipping auto-scroll');
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
    console.log('Bringing to front:', sectionId);
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setSections(prev => {
      const updated = prev.map(s => 
        s.id === sectionId ? { ...s, zIndex: newZIndex } : s
      );
      console.log('Updated z-indexes:', updated.map(s => ({ id: s.id, zIndex: s.zIndex })));
      return updated;
    });
  };

  const openSection = (sectionId: string) => {
    console.log('Opening section:', sectionId);
    setSections(prev => {
      const updated = prev.map(s => 
        s.id === sectionId ? { ...s, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 } : s
      );
      console.log('Updated sections:', updated);
      console.log('Section to open:', updated.find(s => s.id === sectionId));
      return updated;
    });
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

  const handleCommand = (command: string) => {
    console.log('=== COMMAND START ===');
    console.log('Raw command:', command);
    
    const cmd = command.trim().toLowerCase();
    const args = cmd.split(/\s+/).filter(arg => arg.length > 0);
    const baseCmd = args[0];
    let output: string[] = [];

    console.log('Parsed command:', baseCmd, 'Args:', args);

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    if (!baseCmd) {
      console.log('Empty command, returning');
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
        output = [
          "Files and directories:",
          ...sections.map(section => `  ${section.isOpen ? '📂' : '📁'} ${section.name}`),
          ""
        ];
        break;

      case "cat":
        if (args.length < 2) {
          output = ["Usage: cat <filename>", "Available files: about.txt, skills.json, experience.log, projects/, contact.info"];
        } else {
          const filename = args.slice(1).join(' ').toLowerCase(); // Join all remaining args
          let section = null;
          
          // Remove common file extensions for better matching
          const cleanFilename = filename.replace(/\.(txt|json|log|info)$/, '');
          
          // Try to find section by filename or id
          section = sections.find(s => 
            s.name.toLowerCase() === filename ||
            s.name.toLowerCase().includes(filename) ||
            s.id === filename ||
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
          "╠═══════════════════════════════════════════╣",
          "║ 🐛 DEBUG INFO (scroll detection)          ║",
          "╠═══════════════════════════════════════════╣",
          `║ User scrolling:     ${isUserScrolling.toString().padStart(2)} active        ║`,
          `║ Last scroll pos:    ${lastScrollTop.toString().padStart(2)} pixels        ║`,
          `║ Input focused:      ${isInputFocused.toString().padStart(2)} ready         ║`,
          `║ Max Z-index:        ${maxZIndex.toString().padStart(2)} layers        ║`,
          "╚═══════════════════════════════════════════╝"
        ];
        break;

      case "debug":
        output = [
          "🐛 DEBUG INFO:",
          "Debug information is now integrated into the 'status' command.",
          "Use 'status' to see system status and debug information.",
          "Available test commands: test, scrolltest, forcescroll, spam"
        ];
        break;

      case "test":
        // Force open a section for testing
        console.log('TEST: Force opening about section');
        const currentAbout = sections.find(s => s.id === 'about');
        console.log('Current about section:', currentAbout);
        setSections(prev => {
          const updated = prev.map(s => 
            s.id === 'about' ? { ...s, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 } : s
          );
          console.log('Updated sections after test:', updated);
          const openSections = updated.filter(s => s.isOpen && !s.isMinimized);
          console.log('Open sections that should render:', openSections.map(s => ({ id: s.id, isOpen: s.isOpen, isMinimized: s.isMinimized, position: s.position })));
          return updated;
        });
        setMaxZIndex(prev => prev + 1);
        output = ["TEST: Forced about section to open", "Check if window appears above", "Check debug panel in top-right corner", "If window still doesn't appear, there's a rendering issue"];
        break;

      case "scrolltest":
        // Generate comprehensive scroll test content
        const scrollTestLines = [];
        for (let i = 1; i <= 25; i++) {
          scrollTestLines.push(`📋 Scroll test line ${i} - Testing terminal scroll functionality with longer content to ensure scrolling works properly`);
        }
        scrollTestLines.push('');
        scrollTestLines.push('🎯 SCROLL TEST COMPLETE');
        scrollTestLines.push('💡 If you can see this message and scroll up/down smoothly, scrolling is working!');
        scrollTestLines.push('🔄 Use mouse wheel or scrollbar to navigate');
        scrollTestLines.push('⚠️ Scroll should be isolated to this terminal area only');
        scrollTestLines.push('');
        output = scrollTestLines;
        break;

      case "forcescroll":
        // Force set user scrolling to true for testing
        setIsUserScrolling(true);
        setTimeout(() => {
          setIsUserScrolling(false);
        }, 5000);
        output = ["FORCE SCROLL: Set user scrolling to true for 5 seconds", "This tests if the detection mechanism works"];
        break;

      case "simpletest":
        // Test without animation - add a simple div to see if rendering works
        output = ["SIMPLE TEST: Adding a basic window without animation"];
        break;

      case "scrolldebug":
        if (terminalOutputRef.current) {
          const el = terminalOutputRef.current;
          output = [
            "SCROLL DEBUG INFO:",
            `Container height: ${el.clientHeight}px`,
            `Content height: ${el.scrollHeight}px`,
            `Current scroll position: ${el.scrollTop}px`,
            `Max scroll: ${el.scrollHeight - el.clientHeight}px`,
            `Overflow-Y style: ${window.getComputedStyle(el).overflowY}`,
            `Scrollable: ${el.scrollHeight > el.clientHeight ? 'YES' : 'NO'}`,
            `Scroll listeners: Check console for event logs`
          ];
        } else {
          output = ["SCROLL DEBUG: Terminal output ref not found"];
        }
        break;

      case "fillscreen":
        // Fill the screen with enough content to guarantee scrolling
        const fillLines = [];
        for (let i = 1; i <= 30; i++) {
          fillLines.push(`Fill Line ${i}: Testing scrolling functionality with enough content to overflow the 400px container height.`);
        }
        output = ["FILL SCREEN TEST:", ...fillLines, "You should now be able to scroll up and down in the terminal output area."];
        break;

      case "spam":
        // Generate lots of output for scroll testing
        const spamLines = [];
        for (let i = 1; i <= 100; i++) {
          spamLines.push(`Line ${i}: This is a test line to generate lots of output for scroll testing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`);
        }
        output = ["SPAM TEST: Generating 100 lines of output...", ...spamLines, "End of spam test - check scroll behavior"];
        break;

      case "clear":
        setHistory([]);
        return;

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
        output = [
          "PID  TTY          TIME CMD",
          "1    pts/0    00:00:01 portfolio",
          "2    pts/0    00:00:00 node",
          "3    pts/0    00:00:00 react"
        ];
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
            'contac': 'contact'
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

    console.log('Command output:', output);
    setHistory(prev => {
      const newHistory = [...prev, `$ ${command}`, ...output, ""];
      console.log('New history length:', newHistory.length);
      return newHistory;
    });
    console.log('=== COMMAND END ===');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key, 'Input value:', input);
    
    if (e.key === "Enter") {
      if (input.trim()) { // Only process non-empty commands
        console.log('Processing command:', input.trim());
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
      // Simple tab completion for commands
      if (input && !input.includes(' ')) {
        const matches = Object.keys(availableCommands).filter(cmd => cmd.startsWith(input.toLowerCase()));
        if (matches.length === 1) {
          setInput(matches[0] + ' ');
        } else if (matches.length > 1) {
          // Show available completions
          setHistory(prev => [...prev, `$ ${input}`, `Available completions: ${matches.join(', ')}`, ""]);
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
            <span className="text-green-400 font-mono text-sm ml-4">terminal@sivareddy:~$</span>
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
                <span className="text-green-300/80">💡 Test scrolling with 'spam' command to generate 50 lines of output</span>
              </motion.div>
              
              {/* Terminal status line */}
              <div className="text-green-400/40 text-xs mt-4 font-mono flex justify-between items-center">
                <span>Use mouse wheel or scrollbar to scroll up/down in terminal output</span>
                <div className="flex items-center space-x-4">
                  <span className={`${isUserScrolling ? 'text-yellow-400' : 'text-green-400/40'}`}>
                    {isUserScrolling ? '🔄 Trackpad Active' : '💡 Auto-scroll Ready'}
                  </span>
                  <span className={`${isInputFocused ? 'text-green-300' : 'text-yellow-400'}`}>
                    {isInputFocused ? '● Terminal Ready' : '⚠ Click to activate'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Terminal Output Container - ROBUST SCROLLING SOLUTION */}
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
              
              {/* Terminal Output Area - Isolated Scrolling */}
              <div
                ref={terminalOutputRef}
                className="w-full h-[400px] overflow-y-auto terminal-scrollbar bg-black/20 relative terminal-output-container"
                onScroll={(e) => {
                  e.stopPropagation(); // Prevent scroll event from bubbling
                  const target = e.currentTarget;
                  console.log('Terminal output scroll event:', {
                    scrollTop: target.scrollTop,
                    scrollHeight: target.scrollHeight,
                    clientHeight: target.clientHeight,
                    isScrollable: target.scrollHeight > target.clientHeight
                  });
                  
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
                  // Prevent wheel event from propagating to parent
                  e.stopPropagation();
                }}
              >
                {/* Terminal Output Content */}
                <div className="p-4 text-green-400/80 text-sm font-mono whitespace-pre-wrap">
                  {history.length === 0 ? (
                    <div className="text-green-400/40 italic">
                      Terminal output will appear here...
                      <br />
                      Type commands to see output
                      <br />
                      Use 'spam' command to generate test content for scrolling
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
              <span className="text-green-400 text-sm font-bold">$</span>
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
                  // Small delay to allow for clicks on other elements
                  setTimeout(() => setIsInputFocused(false), 100);
                }}
                className="flex-1 bg-transparent text-green-400 text-sm outline-none font-mono placeholder-green-400/50 border-none"
                placeholder="Type a command... (Terminal is ready)"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              {/* Blinking cursor indicator */}
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
                  {/* Mac-style Traffic Light Buttons */}
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
                {/* Dock Separator */}
                <div className="w-1 h-8 bg-green-400/20 rounded-full"></div>
                
                {/* Minimized Windows */}
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
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-green-400 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {section.name}
                    </div>
                  </motion.button>
                ))}
                
                {/* Quick Access Buttons */}
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
                         section.id === 'projects' ? '�️' : 
                         section.id === 'contact' ? '📧' : '📄'}
                      </span>
                    </div>
                    
                    {/* Tooltip */}
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
