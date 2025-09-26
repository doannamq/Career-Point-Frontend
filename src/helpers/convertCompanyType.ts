const convertCompanyType = (type: string): string => {
  switch (type) {
    case "Limited Liability Company":
      return "Công ty trách nhiệm hữu hạn";
    case "Joint Stock Company":
      return "Công ty cổ phần";
    case "Sole Proprietorship":
      return "Doanh nghiệp tư nhân";
    case "100% Foreign-Owned Company":
      return "Công ty 100% vốn nước ngoài";
    case "Joint Venture":
      return "Công ty liên doanh";
    case "Representative Office":
      return "Văn phòng đại diện";
    case "Branch":
      return "Chi nhánh";
    case "Other":
      return "Khác";
    default:
      return type;
  }
};

export { convertCompanyType };
