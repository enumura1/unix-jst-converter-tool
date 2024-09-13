import * as vscode from 'vscode';
import { convertUnixToJst } from '../utils/dateTimeHelpers';

// Convert UNIX timestamp to JST
export async function unixToJstCommand() {
    // Display input box for UNIX timestamp
    const unixTimestamp = await vscode.window.showInputBox({
        prompt: 'Enter UNIX timestamp',
        // real time input err feedback
        validateInput: (value) => {
            // Reject if not a positive integer
            return /^\d+$/.test(value) ? null : 'Please enter a valid UNIX timestamp (positive integer)';
        }
    });

    // no input enter, esc
    if (!unixTimestamp) return; 

    try {
        // unix to jst
        const jstTimeString = convertUnixToJst(parseInt(unixTimestamp));
        // show message
        const copyAction = 'Copy JST to Clipboard';
        const result = await vscode.window.showInformationMessage(
            `UNIX: ${unixTimestamp} => JST: ${jstTimeString}`,
            copyAction
        );
        // If user clicks the copy button
        if (result === copyAction) {
            await vscode.env.clipboard.writeText(jstTimeString);
            // Show feedback for successful copy
            vscode.window.showInformationMessage('JST time copied to clipboard!');
        }
    } catch (error) {
        vscode.window.showErrorMessage("Error converting time");
    }
}
