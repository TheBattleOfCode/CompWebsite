const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create .husky directory if it doesn't exist
const huskyDir = path.join(__dirname, '.husky');
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true });
}

// Create _directory inside .husky
const huskyHelperDir = path.join(huskyDir, '_');
if (!fs.existsSync(huskyHelperDir)) {
  fs.mkdirSync(huskyHelperDir, { recursive: true });
}

// Create husky.sh file
const huskyShPath = path.join(huskyHelperDir, 'husky.sh');
const huskyShContent = `#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  export readonly husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  exit $exitCode
fi`;

fs.writeFileSync(huskyShPath, huskyShContent);

// Make husky.sh executable
try {
  execSync(`chmod +x "${huskyShPath}"`);
} catch (error) {
  console.log('Could not make husky.sh executable. This is expected on Windows.');
}

// Create pre-commit hook
const preCommitPath = path.join(huskyDir, 'pre-commit');
const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged`;

fs.writeFileSync(preCommitPath, preCommitContent);

// Make pre-commit executable
try {
  execSync(`chmod +x "${preCommitPath}"`);
} catch (error) {
  console.log('Could not make pre-commit executable. This is expected on Windows.');
}

console.log('Husky setup complete!');
