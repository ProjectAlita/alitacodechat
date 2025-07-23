import { expect } from '@playwright/test';

export default class ModalComponents {
  constructor(page) {
    this.page = page;
    this.promptModalHeader = page.locator('#alert-dialog-title:nth-child(1)');
    this.promptModalVersion = page.locator('#simple-select-undefined');
    this.promptModalVersionList = page.locator('ul[role="listbox"]');
    this.promptModalVariablesHeader = page.locator('#alert-dialog-title:nth-child(3)');
    this.promptModalVariable = page.locator('.MuiDialogContent-root .MuiInputBase-root textarea[aria-invalid="false"]');
    this.promptModalOkBtn = page.locator('button.MuiButton-root[type="button"]');
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

  async verifyPromptModalClosed() {
    await expect(this.promptModalHeader).not.toBeVisible();
  }
  
  async verifyDisplayedVersion(versionName) {
    await expect(this.promptModalVersion).toHaveText(versionName);
  }

  async chooseVersion(versionName) {
    const versionLocator = this.promptModalVersionList.locator(`li >> text=${versionName}`);
    await this.promptModalVersion.click();
    await versionLocator.waitFor();
    await versionLocator.click();
  }

  async verifyPromptModalVariableName(index, variable) {
    await expect(this.promptModalVariable.nth(index)).toHaveAttribute('id', variable);
  }
}
