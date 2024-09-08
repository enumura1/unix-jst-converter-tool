export function validateDateInput(value: string): { message: string, color: string } | undefined {
  if (value.length === 0) {
      return { message: "Please enter a date in YYYY-MM-DD format", color: "green" };
  }
  
  const parts = value.split('-');
  
  if (parts.length < 3) {
      const missingParts = ['year', 'month', 'day'].slice(parts.length);
      return { message: `Please enter ${missingParts.join(' and ')} (Format: YYYY-MM-DD)`, color: "green" };
  }
  
  if (value.length < 10) {
      return { message: "Please complete the date entry (Format: YYYY-MM-DD)", color: "green" };
  }
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { message: "Invalid date format. Use YYYY-MM-DD", color: "red" };
  }
  
  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return { message: "Invalid date. Please check the entered values", color: "red" };
  }
  
  return undefined; // Valid input
}

export function validateTimeInput(value: string): { message: string, color: string } | undefined {
  if (value.length === 0) {
      return { message: "Please enter a time in HH:mm:ss format", color: "green" };
  }
  
  const parts = value.split(':');
  
  if (parts.length < 3) {
      const missingParts = ['hours', 'minutes', 'seconds'].slice(parts.length);
      return { message: `Please enter ${missingParts.join(' and ')} (Format: HH:mm:ss)`, color: "green" };
  }
  
  if (value.length < 8) {
      return { message: "Please complete the time entry (Format: HH:mm:ss)", color: "green" };
  }
  
  if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
      return { message: "Invalid time format. Use HH:mm:ss", color: "red" };
  }
  
  return undefined; // Valid input
}