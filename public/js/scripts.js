window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('download-pdf').addEventListener('click', async () => {
        console.log('Click');

        const API_BASE_URL = window.location.hostname.includes("localhost")
            ? "http://localhost:3030"
            : "https://create-pdf-five.vercel.app/";

        fetch(`${API_BASE_URL}/generate-pdf`)

        const blob = await res.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sample.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
);