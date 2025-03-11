import axios from "axios";

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('download-pdf').addEventListener('click', async () => {

        const API_BASE_URL = window.location.hostname.includes("localhost")
            ? "http://localhost:3030/api"
            : "https://create-pdf-five.vercel.app/api";

        const res = await axios.get(`${API_BASE_URL}/generate-pdf`, {
            responseType: 'blob' // 📌 ここを追加
        });
        const blob = res.data;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sample.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
);