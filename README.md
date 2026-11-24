# Quote Chat Response

English | [简体中文](./README.zh-CN.md)

Quote selected text from a chat response into the Copilot chat input as a Markdown blockquote — the editor-window version of the "Quote" action from the Agents window.

## Usage

1. Select text in a chat response (focus stays in the chat area — no need to touch the input box)
2. Press your keybinding (or run **Quote Chat Response** from the Command Palette)
3. The quote lands in the chat input without being sent — type your question after it

## Keybinding (bind it yourself)

```json
{
  "key": "shift+.",
  "command": "quoteChatResponse.quote",
  "when": "inChat && !inChatInput"
}
```

## About the `when` clause

- `inChat` = focus is inside the chat widget; `!inChatInput` excludes the input box, so **`shift+.` still types `>` in the input**.
- "has a text selection" **cannot be expressed in `when`** (chat selections have no persistent context key), so the check happens **at runtime**:
  - with a selection → quotes the selection;
  - without a selection but focus on a message → quotes the whole message (same semantics as the built-in Copy action's no-selection branch);
  - nothing at all → shows a warning and leaves the input untouched.

## Notes

- Quote format matches the built-in Quote action: one `> ` per line, plus a trailing blank line for your question.
- The chat selection is read via a clipboard round-trip with `workbench.action.chat.copyItem` (clipboard is saved and restored): its handler reads the DOM selection — the only channel for extensions to obtain chat selection text.
- Insertion uses `workbench.action.chat.open` with `isPartialQuery: true`: fills the input without sending, targeting the chat you are looking at (chat editor tab or sidebar). It **replaces** any existing draft, so trigger the command first, then type your question.
- Native implementation tracking: microsoft/vscode#329103.

## Install

Install **Quote Chat Response** from the VS Code Marketplace.

From source:

```sh
bash ./install.sh
```

Builds and copies into `~/.vscode/extensions` and `~/.vscode-insiders/extensions`; reload the window to activate.
