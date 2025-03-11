import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
    let browser;
    try {
        console.log("🚀 PDF生成開始");

        // ✅ Puppeteerを起動
        const executablePath = await chromium.executablePath() || "/usr/bin/chromium";
        console.log("Chromium executablePath:", executablePath);

        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath,
            headless: "new",
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // ✅ ローカル・本番のURLを設定
        const filePath = process.env.NODE_ENV === "production"
            ? "https://your-vercel-app.vercel.app/index.html"
            : "http://localhost:3030/index.html";

        console.log("📄 ページを開く:", filePath);

        // ✅ ページ遷移のエラーハンドリング
        try {
            await page.goto(filePath, { waitUntil: "networkidle2" });
        } catch (err) {
            console.error("🚨 page.goto() エラー:", err);
            res.status(500).json({ error: "ページの読み込みに失敗しました" });
            return;
        }

        // ✅ フォントのロードを確実に待つ
        await page.waitForSelector("body", { visible: true });
        await page.evaluate(() => document.fonts.ready);

        // ✅ `waitForTimeout` の代わりに `setTimeout()` を使用
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log("✅ ページ準備完了、PDF生成開始");

        // ✅ PDFを生成
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        console.log("✅ PDF生成完了");

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
