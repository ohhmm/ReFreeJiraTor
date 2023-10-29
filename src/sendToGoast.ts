import * as vscode from "vscode";

export async function sendToGoast(command: string) {
  await Promise.all([
    vscode.commands.executeCommand("codeium.openChatView"),
    vscode.commands.executeCommand("workbench.view.extension.webview"),
    vscode.commands.executeCommand("goastgoast.sendMessage", command),
    vscode.commands.executeCommand("workbench.action.focusSideBar"),
  ]);
}
