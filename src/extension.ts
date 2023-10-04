// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "refreejirator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('refreejirator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ReFreeJiraTor!');

		// Get Jira id
		const jiraId = vscode.window.showInputBox({
			placeHolder: 'Enter Jira Id',
			validateInput: (text: string) => {
				return text.length > 0 ? null : 'Please enter a valid jira id';
			}
		});

		// Get branch name
		const branchName = vscode.window.showInputBox({
			placeHolder: 'Enter Branch Name',
			validateInput: (text: string) => {
				return text.length > 0 ? null : 'Please enter a valid branch name';
			}
		});

		// Get commit message
		const commitMessage = vscode.window.showInputBox({
			placeHolder: 'Enter Commit Message',
			validateInput: (text: string) => {
				return text.length > 0 ? null : 'Please enter a valid commit message';
			}
		});

		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
