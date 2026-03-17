const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://cursors.info/', { waitUntil: 'networkidle' });
    const links = await page.$$eval('a', as => as.map(a => a.href));
    console.log("Found links count:", links.length);
    console.log("First 20 links:", links.slice(0, 20));
    
    await page.waitForTimeout(5000);
    const html = await page.$eval('body', el => el.innerHTML);
    const text = await page.$eval('body', el => el.innerText);
    console.log("Body Text:", text.substring(0, 300));
    console.log("Body HTML snippet:", html.substring(0, 1000));
    
    // Check all clickable elements
    const elements = await page.$$eval('*', els => {
        return els.map(el => {
            return {
                tag: el.tagName,
                className: el.className,
                href: el.href || null,
                onClick: !!el.onclick,
            }
        }).filter(e => e.className && typeof e.className === 'string' && e.className.includes('cursor'));
    });
    console.log("Elements mentioning cursor:", elements.slice(0, 10));
    
    await browser.close();
})();
