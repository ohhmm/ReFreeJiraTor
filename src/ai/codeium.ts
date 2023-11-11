import * as vscode from "vscode";

export async function sendToCodeium(command: string) {
  try {
    const extension = vscode.extensions.getExtension("codeium.codeium");
    if (!extension) {
      throw new Error("Codeium extension is not installed.");
    }

    await extension.activate();
    return Promise.all([
       vscode.commands.executeCommand("codeium.chatPanelView.focus",command),
       vscode.commands.executeCommand("codeium.openCodeiumCommand", command),
       vscode.commands.executeCommand("codeium.submitCodeiumCommand", command),
    ]);
  } catch (error) {
    console.error("Error sending query to Codeium:", error);
    throw error;
  }
}