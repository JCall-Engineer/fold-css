# CSS Folding Range Provider

A VS Code extension that provides proper folding ranges for CSS, SCSS, and SASS files based on brace nesting levels.

## Features

- Creates folding ranges for all nested CSS blocks
- Supports overlapping/nested folding regions
- Correctly handles multi-line comments (`/* */`)
- Works with both K&R and Allman brace styles
- Works with CSS, SCSS, and SASS files

## Before & After

### Before

Without this extension, VS Code's default CSS folding may not properly handle deeply nested structures:

![Before](img/before.png)

### After

With this extension, all brace-delimited blocks are properly foldable at their correct nesting levels:

![After](img/after.png)

## How It Works

The extension parses CSS files character-by-character, tracking:

- Opening and closing braces (`{` and `}`)
- Multi-line comment blocks (`/* */`)
- Brace nesting depth using a stack

Each matching pair of braces creates a folding range, allowing for proper nested folding. When braces are on their own line (Allman style), the fold starts from the previous line.
