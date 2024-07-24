// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { ClaudeDevProvider } from "./providers/SidebarProvider"

/*
Built using https://github.com/microsoft/vscode-webview-ui-toolkit

Inspired by
https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/default/weather-webview
https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/frameworks/hello-world-react-cra

*/

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "claude-dev" is now active!')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand("claude-dev.helloWorld", () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage("Hello World from claude-dev!")
	// })
	// context.subscriptions.push(disposable)

	const sidebarProvider = new ClaudeDevProvider(context)

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ClaudeDevProvider.viewType, sidebarProvider, {
			webviewOptions: { retainContextWhenHidden: true },
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand("claude-dev.plusButtonTapped", async () => {
			//const message = "claude-dev.plusButtonTapped!"
			//vscode.window.showInformationMessage(message)
			await sidebarProvider.clearTask()
			await sidebarProvider.postStateToWebview()
			await sidebarProvider.postMessageToWebview({ type: "action", action: "plusButtonTapped" })
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand("claude-dev.popoutButtonTapped", async () => {
			// (this example uses webviewProvider activation event which is necessary to deserialize cached webview, but since we use retainContextWhenHidden, we don't need to use that event)
			// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts
			const tabProvider = new ClaudeDevProvider(context)
			const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
			const panel = vscode.window.createWebviewPanel(
				ClaudeDevProvider.viewType,
				"Claude Dev",
				column || vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
					localResourceRoots: [context.extensionUri],
				}
			)
			// TODO: use better svg icon with light and dark variants (see https://stackoverflow.com/questions/58365687/vscode-extension-iconpath)
			panel.iconPath = vscode.Uri.joinPath(context.extensionUri, "icon.png")

			tabProvider.resolveWebviewView(panel)
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand("claude-dev.settingsButtonTapped", () => {
			//const message = "claude-dev.settingsButtonTapped!"
			//vscode.window.showInformationMessage(message)
			sidebarProvider.postMessageToWebview({ type: "action", action: "settingsButtonTapped" })
		})
	)
}

// This method is called when your extension is deactivated
export function deactivate() {}
