import * as vscode from 'vscode';
import { validateDateInput } from '../utils/dateTimeValidators';

export async function enterDateCommand() {
    const result = await vscode.window.showInputBox({
        prompt: 'Enter date (YYYY-MM-DD)',
        validateInput: (value) => {
            const feedback = validateDateInput(value);
            if (feedback) {
                return {
                    message: feedback.message,
                    severity: feedback.color === "green" ? vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                };
            }
            return null; // Valid input
        }
    });
    if (result) {
        vscode.window.showInformationMessage(`Entered date: ${result}`);
    }
}