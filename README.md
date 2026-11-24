# Quote to Chat

选中一段文本,一键作为 Markdown 引用块插入 Copilot Chat 输入框 —— Agents window 里那个 "Quote" 功能的编辑器版。

## 两个命令

| 命令 | 选区来源 | 触发方式 |
| --- | --- | --- |
| `quoteToChat.quoteChatSelection` | **chat 回复正文里的选区**(DOM selection) | 快捷键(见下),焦点须在 chat 区域(非输入框) |
| `quoteToChat.quoteSelection` | **编辑器里的选区** | 编辑器右键菜单 "Quote Selection into Chat" / 命令面板 |

## 快捷键(自行绑定)

chat 区域选中回复文字 → 引用进输入框:

```json
{
  "key": "shift+.",
  "command": "quoteToChat.quoteChatSelection",
  "when": "inChat && !inChatInput"
}
```

编辑器选中代码 → 引用进输入框(在编辑器里直接按,无需先点输入框):

```json
{
  "key": "cmd+shift+.",
  "command": "quoteToChat.quoteSelection",
  "when": "editorTextFocus && editorHasSelection"
}
```

## when 语义说明

- `inChat` = 焦点在 chat widget 内(回复正文或输入框);`!inChatInput` 把输入框排除,**输入框里 `shift+.` 照常打 `>`**。
- "有 text selection" **写不进 when**:chat 回复选区没有常驻 context key(仅右键菜单弹出瞬间有 `chatContextMenuHasResponseSelection`);`editorHasSelection` 在 chat input 聚焦时只反映输入框自身选区(chatInputPart 的 scoped context key service)。因此选区判断放在**命令运行时**:
  - 有选区 → 引用选区;
  - 没选区但焦点在某条消息上 → 引用整条消息(与内置 Copy 的无选区分支同语义);
  - 啥都没有 → 提示,不动输入框。

## 说明

- 引用格式与内置 Quote 一致:每行前加 `> `,末尾空一行,方便接着打问题。
- chat 选区的读取走 `workbench.action.chat.copyItem` 剪贴板往返(save/restore):该命令的 handler 读 DOM selection(见 `chatCopyActions.ts`),这是扩展侧拿到 chat 选区文本的唯一通道。
- 插入走 `workbench.action.chat.open` + `isPartialQuery: true`,只填不发,且**插到你正在看的那个 chat**(chat editor tab / sidebar 都对);它会**替换**输入框现有草稿,先触发命令出引用、再写问题。
- 官方原生实现跟踪:microsoft/vscode#329103。

## 安装

从 VS Code Marketplace 搜 **Quote to Chat** 安装。

从源码安装:

```sh
bash ./install.sh
```

构建后复制进 `~/.vscode/extensions` 与 `~/.vscode-insiders/extensions`,重载窗口生效。
