import { Metadata } from "next";
import ChatbotPageClient from "./ChatbotPageClient";

export const metadata: Metadata = {
  title: "Career Point | Chatbot",
  description: "Chat with recruiters and employers",
};

const ChatbotPage = () => {
  return <ChatbotPageClient />;
};

export default ChatbotPage;
