import * as vscode from "vscode";

export async function sendToGoast(command: string) {
  try {
    const extension = vscode.extensions.getExtension("goast-ai.goast");
    if (!extension) {
      throw new Error("goastVS extension is not installed.");
    }

    await extension.activate();
    await vscode.commands.executeCommand(
      "workbench.view.extension.webview",
      command,
    );
    const response = await vscode.commands.executeCommand(
      "goast.sendMessage",
      command,
    );
    return response as string;
  } catch (error) {
    console.error("Error sending query to Copilot:", error);
    throw error;
  }
  // const message = {
  //   text: command,
  //   mode: "send",
  //   preserveFocus: true,
  //   selectText: true,
  //   autoTriggerSuggest: true,
  //   keepOpenAfterSubmit: true,
  //   submitOnType: true,
  //   value: command,
  //   placeholder: command,
  //   prompt: command,
  //   title: "Send to Goast",
  //   description: command,
  //   query: command,
  // };
  // await Promise.all([
  //   vscode.commands.executeCommand("goast.startServer"),
  //   vscode.commands.executeCommand("workbench.action.openQuickChat.copilot",message),
  //   vscode.commands.executeCommand("codeium.openChatView", message),
  //   vscode.commands.executeCommand("workbench.view.extension.webview"),
  //   vscode.commands.executeCommand("goast.sendMessage", message),
  //   vscode.commands.executeCommand("workbench.action.focusSideBar"),
  // ]);
}
