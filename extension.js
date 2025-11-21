const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.languages.registerFoldingRangeProvider(
		['css', 'scss', 'sass'],
		{
			provideFoldingRanges(document) {
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
