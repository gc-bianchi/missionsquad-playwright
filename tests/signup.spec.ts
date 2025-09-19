import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const email = `missionsquad_${timestamp}@example.com`;
const password = 'zG3rM8Kq8DCj';
const name = 'Parzlsv';
const lastName = 'Testuser';
const username = `parzlsv${timestamp}`;

test('Sign up for MissionSquad with random credentials', async ({ page }) => {
  test.setTimeout(120000); // Extend timeout to 2 minutes
  await page.goto('https://missionsquad.ai/');

  // click accept analytics button
  await page.getByRole('button', { name: /accept analytics/i }).click();


  await page.getByRole('button', { name: /get started for free/i }).click();

  // Wait for the registration form
  await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();

  await page.getByRole('textbox', { name: /email/i }).type(email);
  await expect(page.getByRole('textbox', { name: /email/i })).toHaveValue(email);
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /username/i }).type(username);
  await expect(page.getByRole('textbox', { name: /username/i })).toHaveValue(username);
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /first name/i }).type(name);
  await expect(page.getByRole('textbox', { name: /first name/i })).toHaveValue(name);
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /last name/i }).type(lastName);
  await expect(page.getByRole('textbox', { name: /last name/i })).toHaveValue(lastName);
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /password password/i }).type(password);
  await expect(page.getByRole('textbox', { name: /password password/i })).toHaveValue(password);
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /confirm password confirm password/i }).type(password);
  await expect(page.getByRole('textbox', { name: /confirm password confirm password/i })).toHaveValue(password);
  await page.waitForTimeout(500);
  

  // Agree to terms
  await page.getByRole('checkbox', { name: /i agree to the terms and conditions/i }).check();

  // Submit the form
  await page.getByRole('button', { name: /register/i }).click();

  // Assert successful sign-up by checking URL contains '/dashboard'
  await expect(page).toHaveURL(/.*\/dashboard/);


  // Select Google as provider
  await page.locator('#autofill-off-provider').type('google');
  await page.waitForTimeout(500);

  await page.getByRole('textbox', { name: /api key/i }).type(process.env.MSQUAD_API_KEY!);
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: /next/i }).click();

  // Use recommended model
  
  await page.getByRole('radio', { name: /recommended model/i }).check();
  const [modelResponse] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/v1/models') && r.status() === 200),
    page.getByRole('button', { name: /next/i }).click()
  ]);
  
  

  // Enter agent description
  await page.locator('textarea').type('summarize my emails');
  await page.waitForTimeout(500);
  const [chatResponse] = await Promise.all([
    page.waitForResponse(r => r.url().includes('v1/chat/completions') && r.status() === 200),
    page.getByRole('button', { name: /next/i }).click()
  ]);
  

  // Wait for prompt generation and workflow
  const [promptResponse] = await Promise.all([
    page.waitForResponse(r => r.url().includes('v1/core/generate/prompt') && r.status() === 200),
    page.getByRole('button', { name: /next/i }).click()
  ]);
  await expect(page.getByText(/Generated System Prompt/i).nth(1)).toBeVisible();
  await page.getByRole('button', { name: /next/i }).click();

  // Review and finish
  await expect(page.getByText(/Review your new Agent/i)).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: /next/i }).click();
  await page.waitForTimeout(500);

  // Verify agent creation
  await page.getByRole('tab', { name: /agent/i }).click();
  await page.waitForTimeout(500);

  await expect(page.getByText(/gemini-2.5-pro-agent /i)).toBeVisible();
  await page.waitForTimeout(500);
});
