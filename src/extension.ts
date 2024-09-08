import * as vscode from 'vscode';

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
                    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? null : 'Please enter a valid date in YYYY-MM-DD format';
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
                    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value) ? null : 'Please enter a valid time in HH:mm:ss format';
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

    context.subscriptions.push(jstToUnixDisposable);
}

export function deactivate() {}