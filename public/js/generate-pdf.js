// const puppeteer = require('puppeteer');
// const path = require('path');

// const generatePDF = async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     const filePath = `file://${path.join(__dirname, '../index.html')}`;
//     await page.goto(filePath, {
//         waitUntil: 'networkidle0'
//     });

//     await page.pdf({
//         path: path.join(__dirname, '../pdf/output.pdf'),
//         format: 'A4',
//         printBackground: true,
//     });

//     await browser.close();
//     console.log('PDF生成完了: pdf/output.pdf');
// }

// generatePDF();