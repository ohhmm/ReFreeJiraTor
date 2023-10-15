import * as vscode from "vscode";

export function sendToGoast(command: string) {
  return vscode.commands.executeCommand(`goastgoast.sendMessage`, command);
}
