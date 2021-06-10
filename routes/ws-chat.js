const WebSocket = require('ws');

const createChatServer = server => {
    const wsServer = new WebSocket.Server({server});

    const map = new Map();

    wsServer.on('connection', (ws, req)=>{
        map.set(ws, {name:''});//用map的方法存取使用者的名稱


        ws.on('message', message =>{
            const mObj = map.get(ws); //用map的方法取得ws的key
            let msg;
            if(! mObj.name){
                //如果沒有名字就將輸入的訊息當成名字
                mObj.name = message;
                msg = `${mObj.name} 進入, 共 ${wsServer.clients.size} 人`;
            } else {
                //如果有名字就把輸入的訊息當成訊息
                msg = `${mObj.name}: ${message}`;
            }

            wsServer.clients.forEach( c => {
                if(c.readyState===WebSocket.OPEN){
                    c.send(msg);
                }
            });
        });
    });
};

module.exports = createChatServer;