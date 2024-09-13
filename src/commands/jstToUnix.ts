import * as vscode from 'vscode';
import { validateDateInput, validateTimeInput } from '../utils/dateTimeValidators';
import { convertJstToUnix } from '../utils/dateTimeHelpers';

// jst to unixtime
export async function jstToUnixCommand() {
    const dateString = await getDateInput();
    if (!dateString) return;
    const timeString = await getTimeInput();
    if (!timeString) return;
    // Combine date and time
    const jstTimeString = `${dateString} ${timeString}`;
    
    try {
        const unixTime = convertJstToUnix(jstTimeString);
        // show info message
        vscode.window.showInformationMessage(`JST: ${jstTimeString} => UNIX timestamp: ${unixTime}`);
    } catch (error) {
        vscode.window.showErrorMessage("Error converting time");
    }
}

// get date
async function getDateInput(): Promise<string | undefined> {
    // dialog option
    const dateOptions = ['Today', 'Yesterday', 'Tomorrow', 'Custom date'];
    const selectedDate = await vscode.window.showQuickPick(dateOptions, {
        placeHolder: 'Select a date or choose custom date'
    });

    // no input enter, esc
    if (!selectedDate) return undefined;

    // custom input
    if (selectedDate === 'Custom date') {
        return vscode.window.showInputBox({
            prompt: 'Enter date (YYYY-MM-DD)',
            // real time input err feedback
            validateInput: (value) => {
                const feedback = validateDateInput(value);
                if (feedback) {
                    return {
                        message: feedback.message,
                        severity: feedback.color === "green" ? 
                            vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                    };
                }
                // 有効な入力値
                return null;
            }
        });
    } else {
        // today
        const date = new Date();
        if (selectedDate === 'Yesterday') date.setDate(date.getDate() - 1);
        if (selectedDate === 'Tomorrow') date.setDate(date.getDate() + 1);
        // Calculate Date
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${
            String(date.getDate()).padStart(2, '0')}`;
    }
}

// get time
async function getTimeInput(): Promise<string | undefined> {
    // dialog option
    const timeOptions = ['00:00:00', '09:00:00', '12:00:00', '18:00:00', 'Current time', 'Custom time'];
    const selectedTime = await vscode.window.showQuickPick(timeOptions, {
        placeHolder: 'Select a time or choose custom time'
    });

    // no input enter, esc
    if (!selectedTime) return undefined;

    // custom input
    if (selectedTime === 'Custom time') {
        return vscode.window.showInputBox({
            prompt: 'Enter time (HH:mm:ss)',
            // real time input err feedback
            validateInput: (value) => {
                const feedback = validateTimeInput(value);
                if (feedback) {
                    return {
                        message: feedback.message,
                        severity: feedback.color === "green" ? 
                            vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                    };
                }
                return null;
            }
        });
    } else if (selectedTime === 'Current time') {
        const now = new Date();
        // return Current time
        return `${String(now.getHours()).padStart(2, '0')}:${
            String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    } else {
        // '00:00:00', '09:00:00', '12:00:00', '18:00:00'
        return selectedTime;
    }
}