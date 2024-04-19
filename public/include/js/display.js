document.addEventListener("DOMContentLoaded", function () {
    const localUrl = 'http://localhost:8080';
    const socket = io(localUrl);
    const did = document.getElementById('did');
    const backgroundBg = document.getElementById('bg');
    const dress = document.getElementById('dress');
    let timeout;

    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            did.style.opacity = 1;
        }, 180000); 
    }

    socket.on('connect', () => {
        console.log('서버에 연결되었습니다.');
        resetTimer(); // 연결되었을 때 타이머 초기화

        socket.on('chat message', ({ img, bg }) => {
            console.log(img, bg);
            did.style.opacity = 0;

            backgroundBg.src = `./images/bg/${bg}`;
            dress.src = `./uploads/face/${img}.png`;

            resetTimer(); // 메시지가 도착했을 때 타이머 초기화
        });
    });
});