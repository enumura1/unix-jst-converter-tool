import * as vscode from 'vscode';

function validateDateInput(value: string): { message: string, color: string } | undefined {
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

function validateTimeInput(value: string): { message: string, color: string } | undefined {
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

export function activate(context: vscode.ExtensionContext) {
    console.log('UNIX-JST Converter is now active!');

    let jstToUnixDisposable = vscode.commands.registerCommand('extension.jstToUnix', async () => {
        const dateOptions = [
            'Today',
            'Yesterday',
            'Tomorrow',
            'Custom date'
        ];

        const selectedDate = await vscode.window.showQuickPick(dateOptions, {
            placeHolder: 'Select a date or choose custom'
        });

        if (!selectedDate) return; // User cancelled

        let dateString: string;
        if (selectedDate === 'Custom date') {
            const customDate = await vscode.window.showInputBox({
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
            if (!customDate) return; // User cancelled
            dateString = customDate;
        } else {
            const date = new Date();
            if (selectedDate === 'Yesterday') date.setDate(date.getDate() - 1);
            if (selectedDate === 'Tomorrow') date.setDate(date.getDate() + 1);
            dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        const timeOptions = [
            '00:00:00',
            '09:00:00',
            '12:00:00',
            '18:00:00',
            'Current time',
            'Custom time'
        ];

        const selectedTime = await vscode.window.showQuickPick(timeOptions, {
            placeHolder: 'Select a time or choose custom'
        });

        if (!selectedTime) return; // User cancelled

        let timeString: string;
        if (selectedTime === 'Custom time') {
            const customTime = await vscode.window.showInputBox({
                prompt: 'Enter time (HH:mm:ss)',
                validateInput: (value) => {
                    const feedback = validateTimeInput(value);
                    if (feedback) {
                        return {
                            message: feedback.message,
                            severity: feedback.color === "green" ? vscode.InputBoxValidationSeverity.Info : vscode.InputBoxValidationSeverity.Error
                        };
                    }
                    return null; // Valid input
                }
            });
            if (!customTime) return; // User cancelled
            timeString = customTime;
        } else if (selectedTime === 'Current time') {
            const now = new Date();
            timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        } else {
            timeString = selectedTime;
        }

        const jstTimeString = `${dateString} ${timeString}`;
        try {
            const [datePart, timePart] = jstTimeString.split(' ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute, second] = timePart.split(':').map(Number);
            const date = new Date(year, month - 1, day, hour, minute, second);
            const unixTime = Math.floor(date.getTime() / 1000) - (9 * 60 * 60);
            vscode.window.showInformationMessage(`JST: ${jstTimeString} => UNIX timestamp: ${unixTime}`);
        } catch (error) {
            vscode.window.showErrorMessage("Error converting time");
        }
    });

    let unixToJstDisposable = vscode.commands.registerCommand('extension.unixToJst', async () => {
        const unixTimestamp = await vscode.window.showInputBox({
            prompt: 'Enter UNIX timestamp',
            validateInput: (value) => {
                return /^\d+$/.test(value) ? null : 'Please enter a valid UNIX timestamp (positive integer)';
            }
        });

        if (!unixTimestamp) return; // User cancelled

        try {
            const timestamp = parseInt(unixTimestamp);
            const date = new Date(timestamp * 1000); // Convert to milliseconds
            date.setHours(date.getHours() + 9); // Convert to JST (+9 hours)
            
            const jstTimeString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            vscode.window.showInformationMessage(`UNIX: ${unixTimestamp} => JST: ${jstTimeString}`);
        } catch (error) {
            vscode.window.showErrorMessage("Error converting time");
        }
    });

    let enterDateDisposable = vscode.commands.registerCommand('extension.enterDate', async () => {
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
    });

    context.subscriptions.push(jstToUnixDisposable, unixToJstDisposable, enterDateDisposable);
}

export function deactivate() {}