window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("download-pdf").addEventListener("click", async () => {
        const API_BASE_URL = window.location.hostname.includes("localhost")
            ? "http://localhost:3030"
            : "https://create-pdf-five.vercel.app/api";

        try {
            const res = await fetch(`${API_BASE_URL}/generate-pdf`);
            if (!res.ok) throw new Error("PDF生成エラー");

            const blob = await res.blob(); // ✅ `blob()` メソッドで取得

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "sample.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("❌ PDFダウンロードエラー:", error);
        }
    });
});
