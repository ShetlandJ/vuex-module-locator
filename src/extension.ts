import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerDefinitionProvider(
        [{ scheme: 'file', language: 'vue' }, { scheme: 'file', language: 'javascript' }],
        {
            provideDefinition(document, position, token) {
                const range = document.getWordRangeAtPosition(position, /['"]entities\/[^'"]+['"]/);
                if (!range) {
                    return;
                }

                const text = document.getText(range).slice(1, -1);
                const resolvedPath = resolveStorePath(text);

                if (resolvedPath && fs.existsSync(resolvedPath)) {
                    const uri = vscode.Uri.file(resolvedPath);
                    return new vscode.Location(uri, new vscode.Position(0, 0));
                }

                vscode.window.showErrorMessage(`Could not resolve path: ${text}`);
                return null;
            }
        }
    );

    context.subscriptions.push(provider);
}

function resolveStorePath(storePath: string): string | null {
    const parts = storePath.split('/');
    if (parts.length < 2) {
        vscode.window.showErrorMessage('Invalid store path format');
        return null;
    }

    const file = parts[parts.length - 2];
    const folderPath = parts.slice(0, -2).join('/');
    const rootDir = path.resolve(vscode.workspace.rootPath || '', 'resources/js/store');

    return path.join(rootDir, folderPath, `${file}.js`);
}

export function deactivate() {}
