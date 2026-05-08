import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ReactNode } from "react";

interface HelpCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HelpCard({ title, icon, children, className = "" }: HelpCardProps) {
  return (
    <Card className={`border-2 border-gray-100 hover:border-gray-200 transition-colors bg-white ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-base font-semibold text-gray-900">
          {icon && <div className="text-gray-600">{icon}</div>}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}