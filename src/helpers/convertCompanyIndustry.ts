const convertCompanyIndustry = (type: string): string => {
  switch (type) {
    case "Information Technology":
      return "Công nghệ thông tin";
    case "Software Development":
      return "Phát triển phần mềm";
    case "E-commerce":
      return "Thương mại điện tử";
    case "Digital Marketing":
      return "Marketing số";
    case "Finance & Banking":
      return "Tài chính & Ngân hàng";
    case "Healthcare":
      return "Y tế";
    case "Education & Training":
      return "Giáo dục & Đào tạo";
    case "Manufacturing":
      return "Sản xuất";
    case "Retail & Consumer Goods":
      return "Bán lẻ & Hàng tiêu dùng";
    case "Construction & Real Estate":
      return "Xây dựng & Bất động sản";
    case "Transportation & Logistics":
      return "Vận tải & Logistics";
    case "Food & Beverage":
      return "Thực phẩm & Đồ uống";
    case "Tourism & Hospitality":
      return "Du lịch & Nhà hàng Khách sạn";
    case "Media & Entertainment":
      return "Truyền thông & Giải trí";
    case "Consulting":
      return "Tư vấn";
    case "Government & Public Sector":
      return "Chính phủ & Khu vực công";
    case "Non-profit":
      return "Phi lợi nhuận";
    case "Other":
      return "Khác";
    default:
      return type;
  }
};

export { convertCompanyIndustry };
