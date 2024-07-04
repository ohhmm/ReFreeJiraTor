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
  // Pseudocode for token validation and refresh
  // This function should check if the current token is valid and refresh it if necessary

  // Retrieve the stored refresh token, client ID, and client secret
  const refreshToken = getStoredRefreshToken();
  const clientId = getClientId();
  const clientSecret = getClientSecret();

  // Construct the POST request payload
  const payload = {
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  };

  // Make the POST request to the Jira token URL
  const response = await fetch('https://auth.atlassian.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  // Parse the response
  if (response.ok) {
    const data = await response.json();
    // Store the new access token and refresh token securely
    storeAccessToken(data.access_token);
    storeRefreshToken(data.refresh_token);
    // Return the new access token
    return data.access_token;
  } else {
    // Handle errors, such as invalid refresh token or network issues
    throw new Error('Failed to refresh Jira access token');
  }
}

// Placeholder functions for secure storage and retrieval of credentials and tokens
function getStoredRefreshToken(): string {
  // Retrieve the stored refresh token from secure storage
  return "your_stored_refresh_token";
}

function getClientId(): string {
  // Retrieve the client ID from secure storage
  return "your_client_id";
}

function getClientSecret(): string {
  // Retrieve the client secret from secure storage
  return "your_client_secret";
}

function storeAccessToken(token: string): void {
  // Store the new access token in secure storage
}

function storeRefreshToken(token: string): void {
  // Store the new refresh token in secure storage
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
