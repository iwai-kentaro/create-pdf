window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('download-pdf').addEventListener('click', async () => {
        console.log('Click');

        const res = await fetch("http://localhost:3030/generate-pdf");
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