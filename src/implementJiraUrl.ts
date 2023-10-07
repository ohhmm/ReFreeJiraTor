import * as vscode from 'vscode';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Function to get Jira description
async function getIssueDescription(jiraUrl: string) {
    const response = await axios.get(jiraUrl);

    const dom = new JSDOM(response.data);
    const doc = dom.window.document;
    const descriptionElement = doc.getElementById("description-val");

    if (descriptionElement) {
        return descriptionElement.textContent || descriptionElement.innerText;
    } else {
        throw new Error('Description element not found in the HTML.');
    }
}

// Function to implement Jira URL
export async function implementJiraUrl() {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from ReFreeJiraTor!');

    // Get Jira URL
    const jira = await vscode.window.showInputBox({
        placeHolder: 'Enter Jira URL',
        validateInput: (url: string) => {
            // check that url is downloadable
            if (!url.startsWith('https://') && !url.startsWith('http://')) {
                return 'Please enter a valid jira url';
            } else {
                return null;
            }
        }
    });

    // use axios to get jira description
    if (jira) {
        const jiraDescription = getIssueDescription(jira);
        // Display the Jira description to the user
        vscode.window.showInformationMessage(`Jira Description: ${jiraDescription}`);
    }

    // Get branch name
    const branchName = await vscode.window.showInputBox({
        placeHolder: 'Enter Branch Name',
        validateInput: (text: string) => {
            return text.length > 0 ? null : 'Please enter a valid branch name';
        }
    });

    // Get commit message
    const commitMessage = await vscode.window.showInputBox({
        placeHolder: 'Enter Commit Message',
        validateInput: (text: string) => {
            return text.length > 0 ? null : 'Please enter a valid commit message';
        }
    });
}
