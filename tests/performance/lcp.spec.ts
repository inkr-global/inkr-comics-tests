const { chromium } = require("playwright");
const { expect } = require("expect");


(async () => {

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Change checklyhq.com to your site's URL,
  // or, even better, define a SITE_URL environment variable
  // to reuse it across your browser checks
  await page.goto(`https://comics.inkr.com?${Date.now()}`);

  // Inject a PerformanceObserver and access web performance metrics
  const LCP = await page.evaluate(() => {
    return new Promise((resolve) => {
      // @ts-ignore PerformanceObserver API is browser-only
      new PerformanceObserver((list: PerformanceObserverEntryList) => {
        const entries = list.getEntries();
        const LCP = entries.at(-1);
        resolve(LCP?.startTime);
      }).observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
    });
  });

  // Add custom assertions to fail your check
  // if your web performance degraded
  expect(parseInt(LCP, 10)).toBeLessThan(1550);

  // Close the browser and end the session
  await browser.close();

})()
