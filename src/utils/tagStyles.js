export function getTagStyles(label = "") {
  const cleanLabel = label.trim().toLowerCase().replace("#", "");

  switch (cleanLabel) {
    case "api":
      return {
        bg: "bg-[#0A1520]",
        border: "border-[#00FFFF]",
        text: "text-[#00FFFF]",
      };
    case "react":
    case "vite":
      return {
        bg: "bg-[#1A0A1A]",
        border: "border-[#FF00FF]",
        text: "text-[#FF00FF]",
      };
    case "sql":
    case "database":
    case "mysql":
      return {
        bg: "bg-[#1A1A0A]",
        border: "border-[#FFD700]",
        text: "text-[#FFD700]",
      };
    case "security":
    case "web":
      return {
        bg: "bg-[#0A1F1A]",
        border: "border-[#39FF14]",
        text: "text-[#39FF14]",
      };
    case "debug":
      return {
        bg: "bg-[#1A0A0A]",
        border: "border-[#FF8C00]",
        text: "text-[#FF8C00]",
      };
    case "translation":
    case "english":
      return {
        bg: "bg-[#0F1E24]",
        border: "border-[#3b82f6]",
        text: "text-[#3b82f6]",
      };
    case "helper":
    case "regex":
    case "node.js":
    case "node":
    case "express":
      return {
        bg: "bg-[#150F24]",
        border: "border-[#a855f7]",
        text: "text-[#a855f7]",
      };
    default: {
      let hash = 0;
      for (let i = 0; i < cleanLabel.length; i++) {
        hash = cleanLabel.charCodeAt(i) + ((hash << 5) - hash);
      }
      const styles = [
        {
          bg: "bg-[#0A1F1A]",
          border: "border-[#39FF14]",
          text: "text-[#39FF14]",
        },
        {
          bg: "bg-[#0A1520]",
          border: "border-[#00FFFF]",
          text: "text-[#00FFFF]",
        },
        {
          bg: "bg-[#1A0A1A]",
          border: "border-[#FF00FF]",
          text: "text-[#FF00FF]",
        },
        {
          bg: "bg-[#1A1A0A]",
          border: "border-[#FF8C00]",
          text: "text-[#FF8C00]",
        },
      ];
      return styles[Math.abs(hash) % styles.length];
    }
  }
}
