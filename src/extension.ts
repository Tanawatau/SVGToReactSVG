// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const svgAttributesToCamelCase = [
  "alignment-baseline",
  "baseline-shift",
  "clip-path",
  "clip-rule",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "dominant-baseline",
  "enable-background",
  "fill-opacity",
  "fill-rule",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "image-rendering",
  "letter-spacing",
  "lighting-color",
  "marker-end",
  "marker-mid",
  "marker-start",
  "pointer-events",
  "shape-rendering",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "unicode-bidi",
  "vector-effect",
  "word-spacing",
  "writing-mode",
  "xlink:href",
  "xmlns:xlink",
];

function kebabToCamelCase(attribute: string): string {
  return attribute.replace(/[-:]([a-z])/g, (match, letter) => letter.toUpperCase());
}

type TEdit = { startPos: vscode.Position; endPos: vscode.Position; convertedSvgBlock: string };

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("convertSvgAttributesToCamelCase", async () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await vscode.commands.executeCommand("editor.action.formatDocument");
      const document = editor.document;
      const fullText = document.getText();

      if (document.languageId !== "javascriptreact" && document.languageId !== "typescriptreact") {
        return;
      }

      if (fullText) {
        const svgTagRegex = /<svg[\s\S]*?>[\s\S]*?<\/svg>/gi;
        let match;
        const edits: TEdit[] = [];

        while ((match = svgTagRegex.exec(fullText)) !== null) {
          const svgBlock = match[0];
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + svgBlock.length);

          const convertedSvgBlock = svgBlock.replace(
            /\b(?:alignment-baseline|baseline-shift|clip-path|clip-rule|color-interpolation|color-interpolation-filters|color-profile|color-rendering|dominant-baseline|enable-background|fill-opacity|fill-rule|flood-color|flood-opacity|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|glyph-orientation-horizontal|glyph-orientation-vertical|image-rendering|letter-spacing|lighting-color|marker-end|marker-mid|marker-start|pointer-events|shape-rendering|stop-color|stop-opacity|stroke-dasharray|stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|stroke-width|text-anchor|text-decoration|text-rendering|unicode-bidi|vector-effect|word-spacing|writing-mode|xlink:href|xmlns:xlink)\b/g,
            (match) => {
              if (svgAttributesToCamelCase.includes(match)) {
                return kebabToCamelCase(match);
              }
              return match;
            }
          );

          edits.push({ startPos, endPos, convertedSvgBlock });
        }
        editor.edit((editBuilder) => {
          for (const { startPos, endPos, convertedSvgBlock } of edits) {
            editBuilder.replace(new vscode.Range(startPos, endPos), convertedSvgBlock);
          }
        });
      } else {
      }
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
