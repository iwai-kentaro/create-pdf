const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.static("public")); // 静的ファイルを提供

// PDFを生成するエンドポイント
app.get("/generate-pdf", async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // HTMLページをレンダリング
    const filePath = `file://${path.join(__dirname, "public/index.html")}`;
    await page.goto(filePath, { waitUntil: "networkidle2" });

    const pdfPath = path.join(__dirname, "output/sample.pdf");

    await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
    });

    await browser.close();

    console.log("PDF生成完了:", pdfPath);

    // クライアントにPDFを送信
    res.download(pdfPath, "sample.pdf");
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
