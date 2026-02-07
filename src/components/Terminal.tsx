import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";

interface HistoryItem {
  type: "command" | "output" | "error" | "ascii";
  content: string;
}

const ASCII_ART = `
 ██████╗ ███████╗██╗   ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
 ██╔══██╗██╔════╝██║   ██║    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
 ██║  ██║█████╗  ██║   ██║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
 ██║  ██║██╔══╝  ╚██╗ ██╔╝       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
 ██████╔╝███████╗ ╚████╔╝        ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
 ╚═════╝ ╚══════╝  ╚═══╝         ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`;

const WELCOME_MESSAGE = `
Bem-vindo ao meu portfólio interativo!
Digite 'help' para ver os comandos disponíveis.
`;

const COMMANDS = {
  help: `
Comandos disponíveis:
  help      - Mostra esta mensagem de ajuda
  about     - Sobre mim
  skills    - Minhas habilidades técnicas
  projects  - Meus projetos
  contact   - Informações de contato
  social    - Redes sociais
  clear     - Limpa o terminal
  date      - Mostra data e hora atual
  whoami    - Quem sou eu?
`,
  about: `
┌─────────────────────────────────────────────────────────────┐
│  SOBRE MIM                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  > Nome: Desenvolvedor Full Stack                           │
│  > Localização: Brasil                                      │
│  > Experiência: +5 anos                                     │
│                                                             │
│  Apaixonado por criar soluções inovadoras e interfaces      │
│  que proporcionam experiências incríveis aos usuários.      │
│                                                             │
│  Especializado em React, TypeScript, Node.js e              │
│  arquiteturas modernas de software.                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  skills: `
┌─────────────────────────────────────────────────────────────┐
│  HABILIDADES TÉCNICAS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FRONTEND                                                   │
│  ████████████████████░░░░  React/Next.js      [██████████]  │
│  ██████████████████░░░░░░  TypeScript         [████████░░]  │
│  █████████████████░░░░░░░  Tailwind CSS       [████████░░]  │
│                                                             │
│  BACKEND                                                    │
│  ████████████████████░░░░  Node.js            [██████████]  │
│  ██████████████████░░░░░░  Python             [████████░░]  │
│  ████████████████░░░░░░░░  PostgreSQL         [███████░░░]  │
│                                                             │
│  DEVOPS                                                     │
│  ██████████████████░░░░░░  Docker             [████████░░]  │
│  ████████████████░░░░░░░░  AWS/GCP            [███████░░░]  │
│  ██████████████░░░░░░░░░░  CI/CD              [██████░░░░]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  projects: `
┌─────────────────────────────────────────────────────────────┐
│  PROJETOS                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [01] E-Commerce Platform                                   │
│       Stack: React, Node.js, PostgreSQL                     │
│       Status: ✓ Completo                                    │
│                                                             │
│  [02] Task Management App                                   │
│       Stack: Next.js, Prisma, TypeScript                    │
│       Status: ✓ Completo                                    │
│                                                             │
│  [03] Real-time Chat Application                            │
│       Stack: Socket.io, React, Redis                        │
│       Status: ⟳ Em desenvolvimento                          │
│                                                             │
│  [04] AI-Powered Dashboard                                  │
│       Stack: Python, TensorFlow, React                      │
│       Status: ◯ Planejado                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  contact: `
┌─────────────────────────────────────────────────────────────┐
│  CONTATO                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📧 Email:    dev@exemplo.com                               │
│  📱 Telefone: +55 (11) 99999-9999                           │
│  📍 Local:    São Paulo, Brasil                             │
│                                                             │
│  Disponível para projetos freelance e oportunidades         │
│  de trabalho remoto.                                        │
│                                                             │
│  Digite 'social' para ver minhas redes sociais.             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  social: `
┌─────────────────────────────────────────────────────────────┐
│  REDES SOCIAIS                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ◈ GitHub:    github.com/seuusuario                         │
│  ◈ LinkedIn:  linkedin.com/in/seuusuario                    │
│  ◈ Twitter:   twitter.com/seuusuario                        │
│  ◈ Portfolio: seusite.dev                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
  whoami: `
> root@portfolio
> Desenvolvedor apaixonado por código limpo e café ☕
`,
  date: () => `
> ${new Date().toLocaleString("pt-BR", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })}
`,
};

export const Terminal = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "ascii", content: ASCII_ART },
    { type: "output", content: WELCOME_MESSAGE },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    setHistory((prev) => [
      ...prev,
      { type: "command", content: `guest@portfolio:~$ ${cmd}` },
    ]);

    if (trimmedCmd === "") {
      return;
    }

    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    if (trimmedCmd === "clear") {
      setHistory([]);
      return;
    }

    const commandOutput = COMMANDS[trimmedCmd as keyof typeof COMMANDS];
    
    if (commandOutput) {
      const output = typeof commandOutput === "function" ? commandOutput() : commandOutput;
      setHistory((prev) => [...prev, { type: "output", content: output }]);
    } else {
      setHistory((prev) => [
        ...prev,
        { 
          type: "error", 
          content: `bash: ${trimmedCmd}: comando não encontrado. Digite 'help' para ajuda.` 
        },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentCommand);
      setCurrentCommand("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const availableCommands = Object.keys(COMMANDS);
      const matches = availableCommands.filter((cmd) => 
        cmd.startsWith(currentCommand.toLowerCase())
      );
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-background flex flex-col"
      onClick={focusInput}
    >
      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-10" />
      
      {/* Full screen terminal */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 md:p-6 overflow-y-auto font-mono text-sm md:text-base"
      >
        {history.map((item, index) => (
          <TerminalOutput key={index} item={item} />
        ))}
        
        <TerminalInput
          ref={inputRef}
          value={currentCommand}
          onChange={setCurrentCommand}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Footer hint */}
      <div className="p-4 text-center text-muted-foreground text-xs border-t border-border/30">
        <span className="animate-glow">
          ↑↓ histórico • Tab autocompletar • help comandos
        </span>
      </div>
    </div>
  );
};
