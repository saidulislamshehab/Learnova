import { useState, useEffect } from 'react';

interface TerminalTypewriterProps {
  commands: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TerminalTypewriter({
  commands,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TerminalTypewriterProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentCommand = commands[currentCommandIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (currentText.length < currentCommand.length) {
            setCurrentText(currentCommand.slice(0, currentText.length + 1));
          } else {
            // Command fully typed, pause then start deleting
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            // Command fully deleted, move to next command
            setIsDeleting(false);
            setCurrentCommandIndex((prev) => (prev + 1) % commands.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentCommandIndex, commands, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <div className="flex items-start space-x-2 pt-2">
      <span className="text-[#A5C89E]/90">$</span>
      <span className="text-white">
        {currentText}
        <span className={`text-[#A5C89E] ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ml-1`}>
          |
        </span>
      </span>
    </div>
  );
}
