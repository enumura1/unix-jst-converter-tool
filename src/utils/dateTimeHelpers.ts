export function convertJstToUnix(jstTimeString: string): number {
  const [datePart, timePart] = jstTimeString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);
  return Math.floor(date.getTime() / 1000) - (9 * 60 * 60);
}

export function convertUnixToJst(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  date.setHours(date.getHours() + 9); // Convert to JST (+9 hours)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}