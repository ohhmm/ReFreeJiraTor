import * as vscode from "vscode";
import * as request from "request";

const JIRA_REST_API_SUFFIX = "rest/api/2/issue";

function getIssueId(urlObj: URL) {
  const path = urlObj.pathname.split("?")[0];
  const pathParts = path.split("/");
  const issueId = pathParts[pathParts.length - 1];
  return issueId;
}

function convertUrlToRestApiUrl(url: string): string {
  if (!url.includes(JIRA_REST_API_SUFFIX)) {
    const urlObj = new URL(url);
    const issueId = getIssueId(urlObj);
    return `${urlObj.origin}/${JIRA_REST_API_SUFFIX}/${issueId}`;
  } else {
    return url;
  }
}

async function getJiraFieldsFromRestApi(
  restApiUrl: string,
  callback: (fields: any) => void,
) {
  // Make the request to the API
  const restRequest = request.get(restApiUrl, (error, response, body) => {
    if (error) {
      console.error(error);
      throw new Error("Error while fetching Jira fields");
    }
    const jsonBody = JSON.parse(body.toString());
    callback(jsonBody["fields"]);
  });
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
    const jiraJsonBody = await getJiraFields(jira, (fields: any) => {
      const summary = fields["summary"];
      const description = fields["description"] || summary;

      // const jiraDescription = await getIssueDescription(jira);
      // Display the Jira description to the user
      vscode.window.showInformationMessage(`Jira Description: ${description}`);

      // Get branch name
      const branchName = getIssueId(new URL(jira));

      // Get commit message
      const commitMessage = summary;
    });
  }
}
