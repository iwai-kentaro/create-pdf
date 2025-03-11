import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // 🔽 public/index.html の内容を取得して直接セット
        const filePath = `file://${path.join(__dirname, "../public/index.html")}`;
        await page.goto(filePath, { waitUntil: "networkidle2" });

        // PDFを生成
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        await browser.close();

        // ヘッダーを設定
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(pdfBuffer);
    } catch (error) {
        console.error("❌ PDF生成エラー:", error);
        res.status(500).json({ error: "PDF生成に失敗しました" });
    }
}
