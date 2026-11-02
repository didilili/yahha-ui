export async function createBasicConsumerPage(browser, width) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
  });
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return { page, errors };
}

export async function openBasicConsumer(page, url) {
  await page.goto(`${url}?basics`);
  await page.getByRole('heading', { name: 'Basic component consumer' }).waitFor();
}
