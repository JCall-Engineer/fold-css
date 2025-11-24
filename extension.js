const vscode = require('vscode');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const config = vscode.workspace.getConfiguration('fold-css');
	const DEBUG = config.get('debug') || false;
	const output = DEBUG ? vscode.window.createOutputChannel("Fold CSS") : null;

	if (DEBUG && output) output.clear();
	if (DEBUG && output) output.appendLine('Fold CSS extension activated!');

	let disposable = vscode.languages.registerFoldingRangeProvider(
		['css', 'scss', 'sass'],
		{
			provideFoldingRanges(document) {
				if (DEBUG && output) output.appendLine(`provideFoldingRanges called for: ${path.basename(document.fileName)}, lineCount: ${document.lineCount}`);
				const ranges = [];
				const stack = [];
				let inComment = false;

				for (let i = 0; i < document.lineCount; i++) {
					const line = document.lineAt(i).text;
					let j = 0;

					while (j < line.length) {
						if (!inComment && line[j] === '/' && line[j + 1] === '*') {
							inComment = true;
							j += 2;
							continue;
						}

						if (inComment && line[j] === '*' && line[j + 1] === '/') {
							inComment = false;
							j += 2;
							continue;
						}

						if (!inComment) {
							if (line[j] === '{') {
								const beforeBrace = line.slice(0, j).trim();
								const startLine = beforeBrace.length === 0 && i > 0 ? i - 1 : i;
								stack.push(startLine);
							} else if (line[j] === '}' && stack.length > 0) {
								const start = stack.pop();
								if (i > start) {
									ranges.push(new vscode.FoldingRange(start, i));
								}
							}
						}

						j++;
					}
				}

				ranges.sort((a, b) => a.start - b.start);
				if (DEBUG && output) output.appendLine(`Returning ranges: ${JSON.stringify(ranges.map(r => ({start: r.start + 1, end: r.end + 1})))}`);
				return ranges;
			}
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
