import { expect } from '@playwright/test';
import path from 'path';

export default class ChatPage {
  constructor(page) {
    this.page = page;
    this.messageField = page.locator('textarea#standard-multiline-static');
    this.sendButton = page.locator('button[data-testid="SendButton"]');
    this.chatArea = page.locator('.MuiList-root');
    this.chatAreaUserMessage = page.locator('ul li:nth-child(1)>div:nth-child(2)');
    this.chatAreaAnswer = page.locator('.MuiList-root > li:nth-child(2) > div:nth-child(2) span');
    this.chatAreaPromptResult = page.locator('ul li:nth-child(2)>div:nth-child(2)');
    this.refreshButton = page.locator('[data-testid="RefreshOutlinedIcon"]');
    this.scrollDownArrow = page.locator('[data-testid="KeyboardDoubleArrowDownOutlinedIcon"]');
    this.cleanChatButton = page.locator('[data-testid="ClearTheChatButton"]');
    this.chatCommandAutocomplete = page.locator('div.MuiPaper-root ul');
    this.promptModalHeader = page.locator('#alert-dialog-title:nth-child(1)');
    this.promptModalVariablesHeader = page.locator('#alert-dialog-title:nth-child(3)');
    this.promptModalVariable = page.locator('.MuiDialogContent-root .MuiInputBase-root textarea[aria-invalid="false"]');
    this.promptModalOkBtn = page.locator('button.MuiButton-root[type="button"]')
    this.promptSettingsOpenVariableModal = page.locator('[data-testid="SettingsButton"]');
    this.chosenPromptName = page.locator('//button[@data-testid="SettingsButton"]/preceding-sibling::span');
    this.serverError = page.locator('#webpack-dev-server-client-overlay');
    this.alertError = page.locator('svg[data-testid="ErrorOutlineIcon"]');
    this.alertMessageIsCopied = page.locator('div.MuiAlert-root');
    this.tooltip = page.locator('.MuiTooltip-tooltip');
    this.alertToDeleteMsgTitle = page.locator('#alert-dialog-title');
    this.alertToDeleteMsgContent = page.locator('#alert-dialog-description');
    this.alertToDeleteMsgBtnCancel = page.locator('div[aria-describedby="alert-dialog-description"] button:nth-child(1)');
    this.alertToDeleteMsgBtnConfirm = page.locator('div[aria-describedby="alert-dialog-description"] button:nth-child(2)');
    this.copyMsgBtn = page.locator('[aria-label="Copy to clipboard"]');
    this.deleteMsgBtn = page.locator('[aria-label="Delete"]');
  }
  
  async openChat() {
    const relativePath = '../../dist-webpack/index.html';
    const absolutePath = path.resolve(relativePath);
    await this.page.goto(`file://${absolutePath}`);
  }

  async typeInMessageField(text) {
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.type(text);
  }

  async checkAutocompleteOptions(expectedOptions) {
    for (let i = 0; i < expectedOptions.length; i++) {
      await expect(this.chatCommandAutocomplete.locator(`li`).nth(i)).toHaveText(expectedOptions[i]);
    }
  }

  async chooseAutocompleteOption(option) {
    const optionLocator = this.chatCommandAutocomplete.locator(`li >> text=${option}`);
    await optionLocator.waitFor();
    await optionLocator.click();
  }

  async checkPromptModalComponents(headerName) {
    await this.promptModalHeader.waitFor();
    await expect(this.promptModalHeader).toHaveText(headerName);
    await expect(this.promptModalVariablesHeader).toHaveText('Variables');
    await expect(this.promptModalVariable.nth(0)).toBeVisible();
  }

  async changePromptModalVariable(index, inputText) {
    await this.promptModalVariable.nth(index).fill('');
    await this.promptModalVariable.nth(index).fill(inputText);
  }

  async applyPrompt() {
    await this.promptModalOkBtn.click();
  }

  async verifyChosenPrompt(promptName) {
    await expect(this.promptSettingsOpenVariableModal).toBeVisible();
    await expect(this.chosenPromptName).toHaveText(promptName);
  }

  async verifySettingsOpenPromptModal() {
    await this.promptSettingsOpenVariableModal.click();
    await this.promptModalHeader.waitFor();
    await expect(this.promptModalHeader).toBeVisible();
  }

  async verifyPromptModalClosed() {
    await expect(this.promptModalHeader).not.toBeVisible();
  }

  async sendMessage() {
    await this.sendButton.click();
    await this.page.waitForTimeout(500)
  }

  async verifyChatPromptResultExists() {
    await this.chatAreaPromptResult.waitFor();
    await expect(this.chatAreaPromptResult).toBeVisible();
  }

  async verifyErrorIsNotDisplayed() {
    const errorMessages = [
      /error/i,
      /failed to fetch/i,
      /xhr poll error/i,
    ];
    for (const errorMessage of errorMessages) {
      const errorLocator = this.page.locator(`text=${errorMessage}`);
      if (await errorLocator.isVisible()) {
        throw new Error('Some Error message is displayed.');
      }
    }
  }

  async verifyErrorOverlayNotDisplayed() {
    await this.page.waitForTimeout(2000);
    if (await this.serverError.isVisible()) {
      throw new Error('Error modal webpack-dev-server is displayed.');
    }
  }

  async verifyErrorAlertNotDisplayed() {
    if (await this.alertError.isVisible()) {
      throw new Error('Error alert is displayed.');
    }
  }

  async verifyDeleteMessageBtnAndClick(tooltipText) {
    await this.chatAreaPromptResult.waitFor();
    await this.chatAreaPromptResult.hover();
    await this.deleteMsgBtn.hover();
    await expect(this.tooltip).toHaveText(tooltipText);
    await this.deleteMsgBtn.click();
  }

  async checkDeleteMessageAlertComponents(alertText) {
    await this.alertToDeleteMsgTitle.waitFor();
    await expect(this.alertToDeleteMsgTitle).toHaveText('Warning');
    await expect(this.alertToDeleteMsgContent).toHaveText(alertText);
    await expect(this.alertToDeleteMsgBtnCancel).toHaveText('Cancel');
    await expect(this.alertToDeleteMsgBtnConfirm).toHaveText('Confirm');
  }

  async confirmDeleteMessage() {
    await this.alertToDeleteMsgBtnConfirm.click();
  }

  async verifyMessageIsDeleted() {
    await expect(this.chatAreaPromptResult).not.toBeVisible();
  }

  async verifyChatIsCleaned() {
    await expect(this.chatAreaUserMessage).not.toBeVisible();
    await expect(this.chatAreaPromptResult).not.toBeVisible();
  }

  async clickCleanChatBtn() {
    await this.chatAreaAnswer.waitFor();
    await this.cleanChatButton.click();
  }
}
