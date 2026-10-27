#!/bin/zsh
set -e
export PATH="/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
cd -- "$(dirname -- "$0")"
if curl --silent --fail http://127.0.0.1:4175/ | /usr/bin/grep -q 'Yahha UI'; then
  open 'http://127.0.0.1:4175/'
  exit 0
fi
npm run dev -- --open
