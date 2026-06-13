const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const interfaces = os.networkInterfaces();
    let addresses = [];
    
    for (let interf in interfaces) {
        for (let indiv_interf in interfaces[interf]) {
            let address = interfaces[interf][indiv_interf];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    res.json({
        message: "Request recebida",
        server_private_ips: addresses,
        hostname: os.hostname()
    });
});

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});