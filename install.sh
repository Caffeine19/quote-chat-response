#!/bin/bash
# Build and install into both Stable and Insiders extension directories.
set -euo pipefail
cd "$(dirname "$0")"

npm install
npm run compile

VERSION=$(node -p "require('./package.json').version")
NAME="CaffeineCat.quote-to-chat-$VERSION"

for DIR in "$HOME/.vscode/extensions" "$HOME/.vscode-insiders/extensions"; do
    rm -rf "$DIR/$NAME"
    mkdir -p "$DIR"
    cp -R . "$DIR/$NAME"
    rm -rf "$DIR/$NAME/node_modules"
    echo "📦 install $PWD -> $DIR/$NAME"
done

echo "done — reload VS Code (or Developer: Restart Extension Host) to activate"
