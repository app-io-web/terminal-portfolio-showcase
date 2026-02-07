interface HistoryItem {
  type: "command" | "output" | "error" | "ascii";
  content: string;
}

interface TerminalOutputProps {
  item: HistoryItem;
}

export const TerminalOutput = ({ item }: TerminalOutputProps) => {
  const getClassName = () => {
    switch (item.type) {
      case "command":
        return "text-foreground";
      case "output":
        return "text-muted-foreground";
      case "error":
        return "terminal-error";
      case "ascii":
        return "text-foreground text-glow text-xs md:text-sm";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <pre className={`whitespace-pre-wrap break-words mb-1 animate-fade-in ${getClassName()}`}>
      {item.content}
    </pre>
  );
};
