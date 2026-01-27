import { test, expect } from '@playwright/test';

test('Form validation prevents submission', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Используем регулярное выражение /Next/i. 
  // Это найдет любую кнопку, где есть слово "Next", игнорируя регистр.
  // .first() гарантирует, что мы возьмем первую попавшуюся кнопку (вашу), 
  // даже если инструментов разработчика несколько.
  const nextButton = page.getByRole('button', { name: /Next/i }).first();

  // Ждем появления кнопки, прежде чем кликать
  await expect(nextButton).toBeVisible();
  await nextButton.click();

  // Проверяем, что кнопка осталась на экране (валидация не пустила дальше)
  await expect(nextButton).toBeVisible();
});