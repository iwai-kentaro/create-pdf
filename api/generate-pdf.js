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

        // ✅ Vercel環境の場合、`file://` ではなく HTTP 経由でアクセス
        const filePath = process.env.NODE_ENV === "production"
            ? "https://your-vercel-app.vercel.app/index.html"
            : `file://${path.join(process.cwd(), "public/index.html")}`;

        await page.goto(filePath, { waitUntil: "load" }); // 🔽 `load` で完全にロード

        // ✅ すべてのフォントと画像が読み込まれるまで待機
        await page.evaluateHandle("document.fonts.ready");

        // ✅ 5秒の遅延を入れて確実にレンダリング
        await page.waitForTimeout(5000);

        // PDFを生成
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // ✅ 背景を描画
        });

        await browser.close();

        // ✅ PDFをバイナリデータとして送信
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.end(pdfBuffer);
    } catch (error) {
        console.error("❌ PDF生成エラー:", error);
        res.status(500).json({ error: "PDF生成に失敗しました" });
    }
}
