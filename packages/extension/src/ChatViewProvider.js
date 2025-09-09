/* eslint-disable no-unused-vars */
const vscode = require('vscode');
const { getAlitaService } = require('./consts');
const { VsCodeMessageTypes, UiMessageTypes } = require('shared');

const getLanguage = (language) => {
  switch ((language || '').toLowerCase()) {
    case 'jsx':
      return 'javascriptreact'
    case 'tsx':
      return 'typescriptreact'
    default:
      return language;
  }
}

const chatViewBuildPath = 'dist';
class ChatViewProvider {
  constructor(
    _extensionUri,
  ) {
    this._extensionUri = _extensionUri;
    this._view = undefined;
  }

  resolveWebviewView(
    webviewView,
    context,
    _token,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [
        this._extensionUri
      ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message) => {
      try {
        const alitaService = getAlitaService()
        switch (message.type) {
          case VsCodeMessageTypes.getSelectedText: {
            const data = this.getSelectedText();
            this.sendMessageToWebView({
              id: message.id,
              type: UiMessageTypes.getSelectedText,
              data,
            })
            break;
          }
          // case VsCodeMessageTypes.getPrompts: {
          //   this.getResponse(alitaService, 'getPrompts', {})
          //   break;
          // }
          // case VsCodeMessageTypes.getPromptDetail: {
          //   this.getResponse(alitaService, 'getPromptDetail', message.data)
          //   break;
          // }
          // case VsCodeMessageTypes.getDatasources: {
          //   this.getResponse(alitaService, 'getDatasources')
          //   break;
          // }
          // case VsCodeMessageTypes.getDatasourceDetail: {
          //   this.getResponse(alitaService, 'getDatasourceDetail', message.data)
          //   break;
          // }
          case VsCodeMessageTypes.getApplications: {
            this.getResponse(alitaService, 'getApplications')
            break;
          }
          case VsCodeMessageTypes.getEmbeddings: {
            this.getResponse(alitaService, 'getEmbeddings')
            break;
          }
          case VsCodeMessageTypes.createConversation: {
            this.getResponse(alitaService, 'createConversation', message.data)
            break;
          }
          case VsCodeMessageTypes.getApplicationDetail: {
            this.getResponse(alitaService, 'getApplicationDetail', message.data)
            break;
          }
          case VsCodeMessageTypes.getChatResponse: {
            this.getResponse(alitaService, 'chat', message.data, 'getChatResponse')
            break;
          }
          case VsCodeMessageTypes.getModelSettings: {
            this.getResponse(alitaService, 'getModelSettings')
            break;
          }
          case VsCodeMessageTypes.getSocketConfig: {
            this.getResponse(alitaService, 'getSocketConfig')
            break;
          }
          case VsCodeMessageTypes.copyCodeToEditor: {
            this.copyCodeToEditor(message.data)
            break;
          }
          case VsCodeMessageTypes.stopDatasourceTask: {
            this.getResponse(alitaService, 'stopDatasourceTask', message.data, '', message.id)
            break;
          }
          case VsCodeMessageTypes.stopApplicationTask: {
            this.getResponse(alitaService, 'stopApplicationTask', message.data, '', message.id)
            break;
          }
        }
      } catch (err) {
        console.error(err)
      }
    });
  }

  getSelectedText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    return text && text.trim();
  }


  startLoading() {
    this.sendMessageToWebView({
      type: UiMessageTypes.startLoading,
    })
  }

  stopLoading() {
    this.sendMessageToWebView({
      type: UiMessageTypes.stopLoading,
    })
  }

  sendSettingChanged() {
    this.sendMessageToWebView({
      type: UiMessageTypes.settingsChanged,
    })
  }

  sendMessageToWebView(message) {
    this._view.webview.postMessage(message)
  }

  getResponse(alitaService, operation, params, messageType, originalMessageId) {
    if (alitaService) {
      this.startLoading()
      alitaService[operation](params).then(data => {
        this.sendMessageToWebView({
          type: UiMessageTypes[messageType || operation],
          data,
          id: originalMessageId,
        })
        this.stopLoading()
      }).catch(err => {
        this.sendMessageToWebView({
          type: UiMessageTypes.error,
          message: err,
          id: originalMessageId
        })
        this.stopLoading()
      })
    } else {
      this.sendMessageToWebView({
        type: UiMessageTypes.error,
        message: 'Alita service not found',
        id: originalMessageId
      })
    }
  }

  copyCodeToEditor({ code, language }) {
    const editor = vscode.window.activeTextEditor
    if (editor) {
      editor.edit((editBuilder) => {
        const cursorLineNotEmpty = editor.document.lineAt(editor.selection.end.line).isEmptyOrWhitespace
        if (cursorLineNotEmpty) {
          editBuilder.insert(editor.selection.end, '\n')
        }
        editBuilder.insert(editor.selection.end, code)
      })
    } else {
      vscode.workspace.openTextDocument({ language })
        .then(doc => {
          vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside)
            .then(editor => {
              vscode.languages.setTextDocumentLanguage(doc, getLanguage(language));
              editor.edit((editBuilder) => {
                editBuilder.insert(new vscode.Position(0, 0), code);
              });
            });
        });
    }
  }

  _getHtmlForWebview(webview) {
    const mainPanelJsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, chatViewBuildPath, 'main.js'));
    const publicPath = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, chatViewBuildPath, 'dist'));


    // Do the same for the stylesheet.
    const styleIndexUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, chatViewBuildPath, 'assets', 'index.css'));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'static', 'main.css'));

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
        <meta charset="UTF-8">
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" />
        <base target="_top" href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Elitea Code Chat</title>
        <script> window.__webview_public_path__ = "${publicPath}"</script>
        <link rel="stylesheet" href="${styleIndexUri}">
        <link rel="stylesheet" href="${styleMainUri}">
        <script type="module" crossorigin src="${mainPanelJsUri}"></script>
			</head>
      <body>
        <div id="root"></div>
      </body>
    </html>`;
  }
}

ChatViewProvider.viewType = 'eliteacodechat.view';
ChatViewProvider.toWebView = 'eliteacodechat.toWebView';

module.exports = ChatViewProvider;