const convertJobType = (jobType: string) => {
  switch (jobType) {
    case "Full-time":
      return "Toàn thời gian";
    case "Part-time":
      return "Bán thời gian";
    case "Contract":
      return "Hợp đồng";
    case "Freelance":
      return "Làm tự do";
    case "Internship":
      return "Thực tập";
    case "Remote":
      return "Làm từ xa";
    case "Hybrid":
      return "Làm việc kết hợp";
    default:
      return jobType;
  }
};

export { convertJobType };
