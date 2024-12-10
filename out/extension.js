"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    const provider = vscode.languages.registerDefinitionProvider([{ scheme: 'file', language: 'vue' }, { scheme: 'file', language: 'javascript' }], {
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
    });
    context.subscriptions.push(provider);
}
function resolveStorePath(storePath) {
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
function deactivate() { }
//# sourceMappingURL=extension.js.map