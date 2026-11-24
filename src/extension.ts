import * as vscode from 'vscode';

const CHAT_OPEN_ACTION_ID = 'workbench.action.chat.open';
const CHAT_COPY_ITEM_ACTION_ID = 'workbench.action.chat.copyItem';

// Same shape as the built-in Quote action (responseSelectionSideChatController.ts):
// one "> " per line, followed by a blank line to type the question after.
function formatBlockquote(text: string): string {
	return `${text.split('\n').map(line => `> ${line}`).join('\n')}\n\n`;
}

// isPartialQuery fills the chat input without sending it. chat.open resolves the
// last focused widget when it is not the plain Chat view (chatWidgetService
// .revealWidget), so the quote lands in the chat editor/session it was taken from.
async function insertQuote(text: string): Promise<void> {
	await vscode.commands.executeCommand(CHAT_OPEN_ACTION_ID, {
		query: formatBlockquote(text),
		isPartialQuery: true,
	});
}

// Reads the chat transcript's DOM selection through the built-in Copy handler:
// workbench.action.chat.copyItem writes the live selection to the clipboard while
// focus is inside the chat widget (chatCopyActions.ts). With no selection it copies
// the focused message instead — the built-in Copy menu item behaves the same.
async function readChatSelection(): Promise<string | undefined> {
	const saved = await vscode.env.clipboard.readText();
	await vscode.commands.executeCommand(CHAT_COPY_ITEM_ACTION_ID);
	const copied = await vscode.env.clipboard.readText();
	await vscode.env.clipboard.writeText(saved);
	if (!copied || copied === saved) {
		return undefined;
	}
	return copied;
}

export function activate(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand('quoteToChat.quoteSelection', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				void vscode.window.showWarningMessage('Quote to Chat: no active editor.');
				return;
			}
			const selection = editor.selection;
			if (selection.isEmpty) {
				void vscode.window.showWarningMessage('Quote to Chat: select some text first.');
				return;
			}

			const text = editor.document.getText(selection).replace(/\r\n/g, '\n');
			await insertQuote(text);
		}),
		vscode.commands.registerCommand('quoteToChat.quoteChatSelection', async () => {
			const text = await readChatSelection();
			if (!text) {
				void vscode.window.showWarningMessage('Quote to Chat: no text selected in the chat.');
				return;
			}
			await insertQuote(text);
		})
	);
}

export function deactivate(): void { }
