import * as vscode from 'vscode';
import { convertUnixToJst } from '../utils/dateTimeHelpers';

// Convert UNIX timestamp to JST
export async function unixToJstCommand() {
    // Display input box for UNIX timestamp
    const unixTimestamp = await vscode.window.showInputBox({
        prompt: 'Enter UNIX timestamp',
        validateInput: (value) => {
            // Reject if not a positive integer
            return /^\d+$/.test(value) ? null : 'Please enter a valid UNIX timestamp (positive integer)';
        }
    });

    
    if (!unixTimestamp) return; 

    try {
        const jstTimeString = convertUnixToJst(parseInt(unixTimestamp));
        vscode.window.showInformationMessage(`UNIX: ${unixTimestamp} => JST: ${jstTimeString}`);
    } catch (error) {
        vscode.window.showErrorMessage("Error converting time");
    }
}