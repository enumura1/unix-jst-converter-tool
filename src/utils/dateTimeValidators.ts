type validateProps = {
    message: string,
    color: string
};

export function validateDateInput(value: string): validateProps | undefined {
  // 何も入力されていない
  if (value.length === 0) {
      return { message: "Please enter a date in YYYY-MM-DD format", color: "green" };
  }
  
  // 例: '2023-05-15' => ['2023', '05', '15']
  const parts = value.split('-');
  // フォーマット通りに何かしら入力されてる場合 
  if (parts.length < 3) {
      const missingParts = ['year', 'month', 'day'].slice(parts.length);
      return {
        // missingParts要素が1つの時：andで文字列結合はなくその1つの要素が入るだけ
        message: `Please enter ${missingParts.join(' and ')} (Format: YYYY-MM-DD)`,
        color: "green"
      };
  }
  
  // YYYY-MM-DDの形式で10文字必要
  if (value.length < 10) {
      return { 
        message: "Please complete the date entry (Format: YYYY-MM-DD)",
        color: "green"
      };
  }
  
  // 正規表現を使用してYYYY-MM-DD形式であることを確認、valueが正規表現に当てはまっているかどうかを見てる
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return {
        message: "Invalid date format. Use YYYY-MM-DD",
        color: "red"
      };
  }
  
  // 例： [2024, 4, 27]
  const [year, month, day] = parts.map(num => Number(num));
  const date = new Date(year, month - 1, day);
  // JSのDateオブジェクトは自動で無効な日付をはじく。それとユーザの入力値が一致を確認
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return { message: "Invalid date. Please check the entered values", color: "red" };
  }
  
  // 全てのチェックのパスした場合
  return undefined;
}

// 時間入力を検証する関数
export function validateTimeInput(value: string): { message: string, color: string } | undefined {
  // 時間入力が空の場合
  if (value.length === 0) {
      return { message: "Please enter a time in HH:mm:ss format", color: "green" };
  }
  
  // 入力を':'で分割（例: '14:30:00' => ['14', '30', '00']）
  const parts = value.split(':');
  if (parts.length < 3) {
      const missingParts = ['hours', 'minutes', 'seconds'].slice(parts.length);
      return { message: `Please enter ${missingParts.join(' and ')} (Format: HH:mm:ss)`, color: "green" };
  }
  
  // 入力が8文字未満の場合（HH:mm:ssの形式で8文字必要）
  if (value.length < 8) {
      return { message: "Please complete the time entry (Format: HH:mm:ss)", color: "green" };
  }
  
  // （時は00-23、分と秒は00-59の範囲であることをチェック）
  if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
      return { message: "Invalid time format. Use HH:mm:ss", color: "red" };
  }
  
  // 全てのチェックのパスした場合
  return undefined;
}