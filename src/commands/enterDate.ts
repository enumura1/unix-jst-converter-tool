// VSCode の拡張機能 API をインポート
import * as vscode from 'vscode';

import { validateDateInput } from '../utils/dateTimeValidators';

// VSCode のコマンドとして使用される関数
export async function enterDateCommand() {
    // 日付の入力を求めるダイアログを表示
    const result = await vscode.window.showInputBox({
        prompt: 'Enter date (YYYY-MM-DD)',
        // 入力値のバリデーション
        validateInput: (value) => {
            // 入力された値を validateDateInput 関数で検証
            const feedback = validateDateInput(value);
            if (feedback) {
                return {
                    // ユーザへのフィードバックメッセージ
                    message: feedback.message,
                    // green：入力中の値に対するバリデーション
                    // red：入力後の値に対するバリデーション
                    severity: feedback.color === "green" ? vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                };
            }
            // 入力が想定通り
            return null;
        }
    });
    // 画面右下にポップアップを表示
    if (result) {
        vscode.window.showInformationMessage(`Entered date: ${result}`);
    }
}