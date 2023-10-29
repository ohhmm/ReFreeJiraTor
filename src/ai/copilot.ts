import * as vscode from "vscode";
import * as request from "request";

export async function askCopilotExtension(query: string) {
  try {
    // Get the Copilot extension
    const copilotExtension = vscode.extensions.getExtension("github.copilot");

    if (!copilotExtension) {
      throw new Error("Copilot extension is not installed.");
    }

    // Activate the Copilot extension
    await copilotExtension.activate();

    // Send the query to Copilot
    const response = await vscode.commands.executeCommand(
      "github.copilot.ask",
      query,
    );

    // Return the response from Copilot
    return response as string;
  } catch (error) {
    console.error("Error sending query to Copilot:", error);
    throw error;
  }
}

export async function postQueryToCopilot(query: string) {
  return new Promise((resolve, reject) => {
    // Make a request to the Copilot API
    // get your API key from the Copilot extension
    const apiKey = vscode.workspace.getConfiguration().get("copilot.apiKey");
    if (!apiKey) {
      throw new Error("Copilot API key is not set.");
    }

    const apiUrl = `https://api.openai.com/v1/codex/generate`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    const data = {
      prompt: query,
      max_tokens: 1024,
      n: 1,
      stop: ["\n"],
    };
    const options = {
      url: apiUrl,
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    };
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const jsonBody = JSON.parse(body);
        const generatedCode = jsonBody.choices[0].text.trim();
        resolve(generatedCode);
      }
    });
  });
}
