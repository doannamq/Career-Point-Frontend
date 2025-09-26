function formatPhoneDisplay(input: string) {
  if (!input) return "";
  let s = String(input).replace(/\D/g, "");

  if (s.startsWith("84") && s.length > 2) s = "0" + s.slice(2);

  if (s.length === 10) return s.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

  if (s.length === 9) return s.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  if (s.length === 11 && s.startsWith("0")) {
    return s.replace(/(\d{2})(\d{4})(\d{5})/, "$1 $2 $3");
  }

  return s.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export default formatPhoneDisplay;
