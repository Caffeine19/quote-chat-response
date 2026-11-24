# Quote Chat Response

[English](./README.md) | 简体中文

选中 chat 回复里的一段文字,一键作为 Markdown 引用块插入 Copilot Chat 输入框 —— Agents window 里那个 "Quote" 功能的编辑器版。

## 用法

1. 在 chat 回复正文里选中一段文字(焦点留在 chat 区域,不用点输入框)
2. 按你的快捷键(或命令面板运行 **Quote Chat Response**)
3. 引用块进入 chat 输入框(不发送),接着输入你的问题即可

## 快捷键(自行绑定)

```json
{
  "key": "shift+.",
  "command": "quoteChatResponse.quote",
  "when": "inChat && !inChatInput"
}
```

## when 语义说明

- `inChat` = 焦点在 chat widget 内;`!inChatInput` 把输入框排除,**输入框里 `shift+.` 照常打 `>`**。
- "有 text selection" **写不进 when**(chat 选区没有常驻 context key),因此选区判断放在**命令运行时**:
  - 有选区 → 引用选区;
  - 没选区但焦点在某条消息上 → 引用整条消息(与内置 Copy 的无选区分支同语义);
  - 啥都没有 → 提示,不动输入框。

## 说明

- 引用格式与内置 Quote 一致:每行前加 `> `,末尾空一行,方便接着打问题。
- chat 选区的读取走 `workbench.action.chat.copyItem` 剪贴板往返(save/restore):该命令的 handler 读 DOM selection,这是扩展侧拿到 chat 选区文本的唯一通道。
- 插入走 `workbench.action.chat.open` + `isPartialQuery: true`,只填不发,且插到你正在看的那个 chat(chat editor tab / sidebar 都对);它会**替换**输入框现有草稿,先触发命令出引用、再写问题。
- 官方原生实现跟踪:microsoft/vscode#329103。

## 安装

从 VS Code Marketplace 搜 **Quote Chat Response** 安装。

从源码安装:

```sh
bash ./install.sh
```

构建后复制进 `~/.vscode/extensions` 与 `~/.vscode-insiders/extensions`,重载窗口生效。
