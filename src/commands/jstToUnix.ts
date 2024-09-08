import * as vscode from 'vscode';
import { validateDateInput, validateTimeInput } from '../utils/dateTimeValidators';
import { convertJstToUnix } from '../utils/dateTimeHelpers';

export async function jstToUnixCommand() {
    const dateString = await getDateInput();
    if (!dateString) return;

    const timeString = await getTimeInput();
    if (!timeString) return;

    const jstTimeString = `${dateString} ${timeString}`;
    try {
        const unixTime = convertJstToUnix(jstTimeString);
        vscode.window.showInformationMessage(`JST: ${jstTimeString} => UNIX timestamp: ${unixTime}`);
    } catch (error) {
        vscode.window.showErrorMessage("Error converting time");
    }
}

async function getDateInput(): Promise<string | undefined> {
    const dateOptions = ['Today', 'Yesterday', 'Tomorrow', 'Custom date'];
    const selectedDate = await vscode.window.showQuickPick(dateOptions, {
        placeHolder: 'Select a date or choose custom'
    });

    if (!selectedDate) return undefined;

    if (selectedDate === 'Custom date') {
        return vscode.window.showInputBox({
            prompt: 'Enter date (YYYY-MM-DD)',
            validateInput: (value) => {
                const feedback = validateDateInput(value);
                if (feedback) {
                    return {
                        message: feedback.message,
                        severity: feedback.color === "green" ? vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                    };
                }
                return null;
            }
        });
    } else {
        const date = new Date();
        if (selectedDate === 'Yesterday') date.setDate(date.getDate() - 1);
        if (selectedDate === 'Tomorrow') date.setDate(date.getDate() + 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

async function getTimeInput(): Promise<string | undefined> {
    const timeOptions = ['00:00:00', '09:00:00', '12:00:00', '18:00:00', 'Current time', 'Custom time'];
    const selectedTime = await vscode.window.showQuickPick(timeOptions, {
        placeHolder: 'Select a time or choose custom'
    });

    if (!selectedTime) return undefined;

    if (selectedTime === 'Custom time') {
        return vscode.window.showInputBox({
            prompt: 'Enter time (HH:mm:ss)',
            validateInput: (value) => {
                const feedback = validateTimeInput(value);
                if (feedback) {
                    return {
                        message: feedback.message,
                        severity: feedback.color === "green" ? vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                    };
                }
                return null;
            }
        });
    } else if (selectedTime === 'Current time') {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    } else {
        return selectedTime;
    }
}