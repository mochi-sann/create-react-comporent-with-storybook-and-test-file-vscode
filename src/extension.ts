import * as vscode from 'vscode';
import { createFile, createFolder } from './file';
import {
  javascriptComponentTemplate,
  javascriptTestTemplate,
  StoryBookJSTemplate,
} from './template/javascriptTemplate';
import TemplateOptions, { FileExtension, FileType, FunctionType, TestLibrary } from './template/templateOptions';
import {
  typescriptComponentTemplate,
  typescriptTestTemplate,
  StoryBookTSTemplate,
} from './template/typescriptTemplate';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.createReactComponent', async (uri: vscode.Uri) => {
    const componentName = await vscode.window.showInputBox({
      prompt: `Create React component in ${uri.path}`,
      placeHolder: 'MyComponent',
    });

    if (componentName !== undefined && componentName.length > 0) {
      const config = vscode.workspace.getConfiguration('createReactComponent');
      const isTypescript = config.get('language') === 'typescript';

      const options: TemplateOptions = {
        name: componentName,
        testLibrary: config.get('testingLibrary') as TestLibrary,
        cleanup: config.get('testingLibrary.cleanup') as boolean,
        functionType: config.get('functionType') as FunctionType,
        fileExtension: config.get('fileExtension') as FileExtension,
      };
      const createModule = config.get('createModule') as boolean;
      const dir = createModule ? `${uri.path}/${componentName}` : uri.path;
      const indexUri = `${dir}/index.${isTypescript ? 'ts' : 'js'}`;
      const isWithX = options.fileExtension === 'withX';
      const typescriptFileExtension = isWithX ? 'tsx' : 'ts';
      const javascriptFileExtension = isWithX ? 'jsx' : 'js';
      const fileExtension = isTypescript ? typescriptFileExtension : javascriptFileExtension;
      const componentUri = `${dir}/${componentName}.${fileExtension}`;
      const testFileUri = `${dir}/${componentName}.test.${fileExtension}`;
      const StoriesFileUri = `${dir}/${componentName}.stories.${fileExtension}`;

      if (createModule) {
        // フォルダーを作る
        createFolder(dir, vscode.window);
        // createFile(indexUri, indexTemplate(options), vscode.window);
      }
      // Componentファイルを作る
      createFile(
        componentUri,
        isTypescript ? typescriptComponentTemplate(options) : javascriptComponentTemplate(options),
        vscode.window,
      );

      // テストファイルを作る
      createFile(
        testFileUri,
        isTypescript ? typescriptTestTemplate(options) : javascriptTestTemplate(options),
        vscode.window,
      );

      // stories ファイルを作る
      createFile(
        StoriesFileUri,
        isTypescript ? StoryBookTSTemplate(options) : StoryBookJSTemplate(options),
        vscode.window,
      );

      const openFiles = config.get('openFiles') as FileType[];
      const textDocumentShowOptions: vscode.TextDocumentShowOptions = {
        preserveFocus: false,
        preview: false,
      };
      if (openFiles.includes('component' as FileType)) {
        const document = await vscode.workspace.openTextDocument(componentUri);
        await vscode.window.showTextDocument(document, textDocumentShowOptions);
      }
      if (openFiles.includes('test' as FileType)) {
        const document = await vscode.workspace.openTextDocument(testFileUri);
        await vscode.window.showTextDocument(document, textDocumentShowOptions);
      }
      if (openFiles.includes('index' as FileType)) {
        const document = await vscode.workspace.openTextDocument(indexUri);
        await vscode.window.showTextDocument(document, textDocumentShowOptions);
      }
    } else {
      vscode.window.showErrorMessage('Must provide component name');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
