function formatCompanyAddress(address: string): string {
  if (!address) return "";

  const parts = address.split(",").map((p) => p.trim());

  if (parts.length < 2) return address;

  const district = parts[parts.length - 2];
  const city = parts[parts.length - 1];

  return `${district}, ${city}`;
}

export { formatCompanyAddress };
