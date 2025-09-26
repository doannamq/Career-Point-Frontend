const convertCompanySize = (size: string | undefined) => {
  switch (size) {
    case "1-10 employees":
      return "1-10 nhân viên";
    case "11-50 employees":
      return "11-50 nhân viên";
    case "51-200 employees":
      return "51-200 nhân viên";
    case "201-500 employees":
      return "201-500 nhân viên";
    case "501-1000 employees":
      return "501-1000 nhân viên";
    case "1000+ employees":
      return "Trên 1000 nhân viên";
    default:
      return "Không xác định";
  }
};

export { convertCompanySize };
