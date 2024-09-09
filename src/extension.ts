import * as vscode from 'vscode';
import { jstToUnixCommand } from './commands/jstToUnix';
import { unixToJstCommand } from './commands/unixToJst';
import { enterDateCommand } from './commands/enterDate';

export function activate(context: vscode.ExtensionContext) {
    console.log('UNIX-JST Converter is now active!');

    context.subscriptions.push(
        // JSTTIME⇒UNIXTIME
        vscode.commands.registerCommand('extension.jstToUnix', jstToUnixCommand),
        vscode.commands.registerCommand('extension.enterDate', enterDateCommand),
        // UNIXTIME⇒JSTTIME
        vscode.commands.registerCommand('extension.unixToJst', unixToJstCommand),
    );
}

export function deactivate() {}