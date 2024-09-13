// JSTの日時をUNIXタイムスタンプに変換
export function convertJstToUnix(jstTimeString: string): number {
  const [datePart, timePart] = jstTimeString.split(' ');
  // 日付⇒年、月、日に分割し数値に変換
  const [year, month, day] = datePart.split('-').map(num => Number(num));
  // 時間⇒時、分、秒に分割し、数値に変換
  const [hour, minute, second] = timePart.split(':').map(num => Number(num));
  const date = new Date(year, month - 1, day, hour, minute, second);
  // JST日時をUTC基準のUNIXタイムスタンプに変換
  return Math.floor(date.getTime() / 1000) - (9 * 60 * 60);
}

// UNIXタイムスタンプをJSTの日時に変換
export function convertUnixToJst(unixTimestamp: number): string {
  // UNIXタイムスタンプ（秒）をUTCミリ秒に変換
  const date = new Date(unixTimestamp * 1000);
  // TO JST (+9 hours)
  date.setHours(date.getHours() + 9);
  // 日時を YYYY-MM-DD HH:mm:SS 形式の文字列に整形 
  return `${date.getFullYear()}-${
    // パディングを追加
    String(date.getMonth() + 1).padStart(2, '0')}-${
    String(date.getDate()).padStart(2, '0')} ${
    String(date.getHours()).padStart(2, '0')}:${
    String(date.getMinutes()).padStart(2, '0')}:${
    String(date.getSeconds()).padStart(2, '0')}`;
}
