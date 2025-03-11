import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import fs from "fs";

export default async function handler(req, res) {
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless
        });

        const page = await browser.newPage();
        const filePath = `file://${path.join(process.cwd(), "public/index.html")}`;
        await page.goto(filePath, { waitUntil: "networkidle2" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.error("❌ PDF生成エラー:", error);
        res.status(500).json({ error: "PDF生成に失敗しました" });
    }
}
