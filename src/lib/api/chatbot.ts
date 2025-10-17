import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/v1";

type ChatbotResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export const chatWithBot = async (message: string): Promise<ChatbotResponse> => {
  try {
    const formData = new FormData();
    formData.append("msg", message);

    const response = await axios.post(`${API_URL}/chatbot/get`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: "Chatbot response received",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error chatting with bot:", error);
    return {
      success: false,
      message: "Error chatting with bot",
      data: error.response?.data,
    };
  }
};

interface StreamCallbacks {
  onStart?: () => void;
  onContent?: (content: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: string) => void;
}

export const streamChatWithBot = (message: string, callbacks: StreamCallbacks): (() => void) => {
  const { onStart, onContent, onComplete, onError } = callbacks;

  const eventSource = new EventSource(`${API_URL}/chatbot/stream?msg=${encodeURIComponent(message)}`);

  eventSource.onopen = () => {
    console.log("Stream connection opened");
    onStart?.();
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "status":
          console.log("Status:", data.content);
          break;

        case "content":
          onContent?.(data.content);
          break;

        case "done":
          console.log("Stream completed");
          onComplete?.(data.full_content);
          eventSource.close();
          break;

        case "error":
          console.error("Stream error:", data.content);
          onError?.(data.content);
          eventSource.close();
          break;

        default:
          console.warn("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing stream data:", error);
      onError?.("Lỗi khi xử lý dữ liệu từ server");
      eventSource.close();
    }
  };

  eventSource.onerror = (error) => {
    console.error("EventSource error:", error);
    onError?.("Lỗi kết nối đến server");
    eventSource.close();
  };

  // Trả về hàm cleanup để có thể hủy stream
  return () => {
    eventSource.close();
  };
};
