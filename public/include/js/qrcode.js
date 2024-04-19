document.addEventListener("DOMContentLoaded", function () {
    let queryString = window.location.search;
    let imgName = queryString.replace('?=', '');
    document.getElementById('QRimg').src = `./uploads/qr/${imgName}.png`;

    let download = document.getElementById('downBtn');
    
    download.addEventListener('click', (e) => {
        e.preventDefault();

        let link = document.createElement('a');
        link.href = `./uploads/qr/${imgName}.png`;
        link.download = 'qrcode.png';
        link.click();
    })
})