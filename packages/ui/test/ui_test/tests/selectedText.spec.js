import { test, expect } from '@playwright/test';
import ChatPage from '../po/chat.page';

test('Verify selected text is sent in system message', async ({ page }) => {
  const chatPage = new ChatPage(page);
  const customSelectedText = 'Custom selected text for testing';
  
  await page.route('**/localhost:3333/**', async (route, request) => {
    const urlObj = new URL(request.url());
    
    if (urlObj.searchParams.get('type') === 'extension.getSelectedText') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: customSelectedText,
          id: urlObj.searchParams.get('id'),
          type: "ui.getSelectedText"
        })
      });
      return;
    }
    await route.continue();
  });
  
  await page.addInitScript(() => {
    window.capturedSocketMessages = [];
    
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      const ws = new OriginalWebSocket(url, protocols);
      
      const originalSend = ws.send;
      ws.send = function(data) {
        window.capturedSocketMessages.push(data);
        return originalSend.call(this, data);
      };
      
      return ws;
    };
  });
  
  await chatPage.openChat();
  await page.waitForLoadState('domcontentloaded');
  await chatPage.sendMessage('hello');
  await page.waitForFunction(() => window.capturedSocketMessages.length > 0);

  const socketMessages = await page.evaluate(() => {
    return window.capturedSocketMessages || [];
  });
  
  const promptlibMessage = socketMessages.find(msg => 
    msg.startsWith('42[') && msg.includes('promptlib_predict')
  );
  
  expect(promptlibMessage).toBeDefined();
  const messageData = JSON.parse(promptlibMessage.substring(2))[1];
  const systemMessage = messageData.messages[0];
  expect(systemMessage.role).toBe('system');
  expect(systemMessage.content).toBe(customSelectedText);
});