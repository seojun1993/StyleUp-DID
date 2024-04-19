const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080;
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('display.html');
});

app.post('/uploads/face', (req, res) => {
    const imageData = req.body?.image;
    const params = req.body?.params
    if (!imageData) {
        console.error('이미지 데이터가 없습니다.');
        return res.status(400).json({ success: false, error: '이미지 데이터가 없습니다.' });
    }

    if(!params){
        console.error('선택된 정보가 없습니다.');
    }
    
    const imgName = UniqueImgName();
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const imagePath = path.join(__dirname, 'public/uploads/face', imgName  + '.png');
    const slicePath = imagePath.split('public/uploads/face')[1];
    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
    try{
        if (err) {
            console.error('이미지 저장 중 오류 발생:', err);
            res.status(500).json({ success: false, error: '이미지 저장 중 오류 발생' });
        } else {
            console.log('이미지 저장 완료:', imagePath);
            io.emit('newImage', { imgName, params });
            res.json({ success: true, imagePath, slicePath, imgName, params  }); // 테스트서버
        }
    }
    catch{
    console.log(err);
    }

    });
});

app.post('/uploads/qr', (req, res) => {
    const imageData = req.body?.image;

    if (!imageData) {
        console.error('이미지 데이터가 없습니다.');
        return res.status(400).json({ success: false, error: '이미지 데이터가 없습니다.' });
    }

    const imgName = UniqueImgName();
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const imagePath = path.join(__dirname, 'public/uploads/qr', imgName  + '.png');

    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
    try{
        if (err) {
            console.error('이미지 저장 중 오류 발생:', err);
            res.status(500).json({ success: false, error: '이미지 저장 중 오류 발생' });
        } else {
            console.log('이미지 저장 완료:', imagePath);
            res.json({ success: true, imgName  }); // 테스트서버
        }
    }
    catch{console.log(err);}

    });
});

app.get('/display.html', (req, res) => {    
    try{
        if (err) {

        } else {
            io.emit('chat message', 'asdcasdc' );
        }
    }
    catch{
    console.log(err);
    }
});

io.on('connection', (socket) => {
    console.log('사용자가 연결됨');

    socket.on('disconnect', () => {
        console.log('사용자가 연결 해제됨');
    });
});

server.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

// 이미지명 난수화 + TimeStamp 해서 보내기 
function UniqueImgName() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${randomString}_${year}${month}${day}_${hours}${minutes}`;
}