import https from "https";

export const wakeServer = () => {

    function sendRequestToServer() {
        const options = {
            hostname: 'tg-wtf.onrender.com',
            port: 443,
            path: '/',
            method: 'GET',
        };

        const req = https.request(options, (res) => {
            console.log(`Status code: ${res.statusCode}`);
        });

        req.on('error', (error) => {
            console.error(`Error sending request: ${error}`);
        });

        req.end();
    }

    setInterval(sendRequestToServer, 150000);

}