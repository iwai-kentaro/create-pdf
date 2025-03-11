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
        const filePath = path.join(process.cwd(), "public/index.html");
        const htmlContent = fs.readFileSync(filePath, "utf-8");
        await page.setContent(htmlContent, { waitUntil: "networkidle2" });

        // PDFを生成
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        await browser.close();

        // ✅ PDFをバイナリデータとして送信する
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
        res.setHeader("Content-Length", pdfBuffer.length); // 🔽 追加
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.end(pdfBuffer); // ✅ `res.send()` ではなく `res.end()` を使う
    } catch (error) {
        console.error("❌ PDF生成エラー:", error);
        res.status(500).json({ error: "PDF生成に失敗しました" });
    }
}
