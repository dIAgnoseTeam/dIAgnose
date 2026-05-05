import * as LucideIcons from "lucide-react";

// Componente para renderizar los iconos de forma dinámica
const DynamicIcon = ({ name, size = 16, className = "" }) => {
  const Icon = LucideIcons[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
};

export { DynamicIcon };
