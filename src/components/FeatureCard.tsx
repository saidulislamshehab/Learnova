import React from 'react';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights?: string[];
}

export const FeatureCard = ({ icon, title, description, highlights }: FeatureCardProps) => {
  return (
    <Card className="bg-card border-border hover:border-[#8b5cf6]/50 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-[#8b5cf6] group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            {highlights && (
              <ul className="space-y-1">
                {highlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#8b5cf6] rounded-full"></div>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};