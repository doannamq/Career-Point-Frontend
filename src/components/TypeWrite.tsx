import React, { useState, useEffect } from "react";

const TypewriterAnimation = () => {
  const texts = ["smart recommendations", "AI-powered search", "personalized insights"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];

    if (isTyping) {
      // Typing effect
      if (charIndex < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100); // Tốc độ đánh chữ
        return () => clearTimeout(timeout);
      } else {
        // Dừng lại một chút sau khi đánh xong
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Dừng 2 giây
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting effect
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 100); // Tốc độ xóa nhanh hơn
        return () => clearTimeout(timeout);
      } else {
        // Chuyển sang text tiếp theo
        const timeout = setTimeout(() => {
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          setIsTyping(true);
        }, 1500); // Dừng một chút trước khi bắt đầu text mới
        return () => clearTimeout(timeout);
      }
    }
  }, [currentTextIndex, charIndex, isTyping, texts]);

  return (
    <div className="text-center">
      <h1
        className="text-4xl font-tobias tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 leading-[1.2] pb-1"
        style={{ fontFamily: "Tobias, sans-serif" }}>
        <p>
          {currentText}
          <span
            className="inline-block w-1 ml-1 animate-pulse bg-primary/70"
            style={{
              height: "0.75em",
              animation: "blink 1s infinite",
            }}></span>
        </p>
      </h1>

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TypewriterAnimation;
