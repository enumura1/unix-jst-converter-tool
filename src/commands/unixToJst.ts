import * as vscode from 'vscode';
import { convertUnixToJst } from '../utils/dateTimeHelpers';

export async function unixToJstCommand() {
    const unixTimestamp = await vscode.window.showInputBox({
        prompt: 'Enter UNIX timestamp',
        validateInput: (value) => {
            return /^\d+$/.test(value) ? null : 'Please enter a valid UNIX timestamp (positive integer)';
        }
    });

    if (!unixTimestamp) return; // User cancelled

    try {
        const jstTimeString = convertUnixToJst(parseInt(unixTimestamp));
        vscode.window.showInformationMessage(`UNIX: ${unixTimestamp} => JST: ${jstTimeString}`);
    } catch (error) {
        vscode.window.showErrorMessage("Error converting time");
    }
}