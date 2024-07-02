import * as vscode from "vscode";
import * as request from "request";
import * as bugs from "./bugtracker/issue";
import { askCopilotExtension } from "./ai/copilot";
import { sendToGoast } from "./ai/goast";
import { sendToCodeium } from "./ai/codeium";

function convertUrlToRestApiUrl(url: string): string {
  const urlObj = bugs.newIssueURL(url);
  if (urlObj && !url.includes(urlObj.restApiSuffix())) {
    return urlObj.restApiUrl().toString();
  } else {
    return url;
  }
}

async function getJiraFieldsFromRestApi(
  restApiUrl: string,
  callback: (fields: any) => void,
) {
  // Placeholder for token refresh logic
  const token = await getValidToken();

  // Make the request to the API
  const restRequest = request.get(
    {
      url: restApiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        throw new Error("Error while fetching Jira fields");
      }
      const jsonBody = JSON.parse(body.toString());
      callback(jsonBody["fields"]);
    }
  );
}

async function getValidToken(): Promise<string> {
  // Placeholder function to get a valid token
  // This function should check if the current token is valid and refresh it if necessary
  // For now, it returns a dummy token
  return "your_access_token_here";
}

async function getJiraFields(url: string, callback: (fields: any) => void) {
  const restApiUrl = convertUrlToRestApiUrl(url);
  await getJiraFieldsFromRestApi(restApiUrl, callback);
}

// Function to get Jira description
async function getIssueDescription(jiraUrl: string) {
  const jiraJsonBody = await getJiraFields(jiraUrl, (fields: any) => {
    const description = fields["description"] || fields["summary"];
  });
}

// Function to implement Jira URL
export async function implementJiraUrl() {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  vscode.window.showInformationMessage("Hello World from ReFreeJiraTor!");

  // Get Jira URL
  const jira = await vscode.window.showInputBox({
    placeHolder: "Enter Jira URL",
    validateInput: (url: string) => {
      // check that url is downloadable
      if (!url.startsWith("https://") && !url.startsWith("http://")) {
        return "Please enter a valid jira url";
      } else {
        return null;
      }
    },
  });

  if (jira) {
    const jiraJsonBody = await getJiraFields(jira, async (fields: any) => {
      const summary = fields["summary"];
      const description = fields["description"] || summary;

      await Promise.all([
        vscode.env.clipboard.writeText(description), // copy description to clipboard
        sendToCodeium(description),
        sendToGoast(description),
        askCopilotExtension(description),
        vscode.window.showInformationMessage(`Copied to clipboard for Sending to AI plugins this: ${description}`)
      ]);

      // Get branch name
      const branchName = bugs.newIssueURL(jira).getIssueId();

      // Get commit message
      const commitMessage = summary;
    });
  }
}
