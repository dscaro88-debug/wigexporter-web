#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
MIRROR_DIR="$HOME/Library/Application Support/DSHair/WigExporterPreview"
LAUNCH_AGENT_DIR="$HOME/Library/LaunchAgents"
PLIST_NAME="com.dshair.wigexporter.preview.plist"
PLIST_SOURCE="$ROOT_DIR/ops/$PLIST_NAME"
PLIST_DESTINATION="$LAUNCH_AGENT_DIR/$PLIST_NAME"
SERVICE_LABEL="com.dshair.wigexporter.preview"
PREVIEW_URL="http://localhost:4199/genius-weft-human-hair-extensions.html"
OPEN_PREVIEW="true"

if [[ "${1:-}" == "--no-open" ]]; then
  OPEN_PREVIEW="false"
fi

mkdir -p "$MIRROR_DIR" "$LAUNCH_AGENT_DIR"

echo "Updating the local WigExporter preview mirror..."
/usr/bin/rsync -a --delete --exclude ".DS_Store" "$ROOT_DIR/" "$MIRROR_DIR/"
cp "$PLIST_SOURCE" "$PLIST_DESTINATION"

if launchctl print "gui/$UID/$SERVICE_LABEL" >/dev/null 2>&1; then
  launchctl kickstart -k "gui/$UID/$SERVICE_LABEL"
else
  launchctl bootstrap "gui/$UID" "$PLIST_DESTINATION"
fi

sleep 1

if ! curl -fsS "$PREVIEW_URL" >/dev/null; then
  echo "Preview service did not become ready. Check /tmp/wigexporter-preview-error.log"
  exit 1
fi

echo "WigExporter preview is ready:"
echo "$PREVIEW_URL"

if [[ "$OPEN_PREVIEW" == "true" ]]; then
  open "$PREVIEW_URL"
fi
