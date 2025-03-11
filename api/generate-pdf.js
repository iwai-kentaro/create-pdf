import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath() || "/usr/bin/chromium",
            headless: "new",
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // ✅ 本番環境は Vercel の URL, ローカル環境は `http://localhost:3030/index.html`
        const filePath = process.env.NODE_ENV === "production"
            ? "https://your-vercel-app.vercel.app/index.html"
            : "http://localhost:3030/index.html";  // ✅ 変更

        await page.goto(filePath, { waitUntil: "networkidle2" }); // ✅ 変更

        // ✅ 画像やフォントのロードを待機
        await page.waitForTimeout(3000); // 🔽 追加 (フォント・画像が遅れるのを防ぐ)
        await page.evaluateHandle("document.fonts.ready");

        // ✅ PDF生成
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // ✅ 背景を描画
        });

        await browser.close();

        // ✅ バイナリデータで送信
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.end(pdfBuffer);
    } catch (error) {
        console.error("❌ PDF生成エラー:", error);
        if (browser) await browser.close();
        res.status(500).json({ error: "PDF生成に失敗しました" });
    }
}
