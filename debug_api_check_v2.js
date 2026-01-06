const http = require('http');

const run = () => {
    const email = `debug_${Date.now()}@example.com`;
    const password = "Password@123";

    const postData = JSON.stringify({
        email: email,
        password: password,
        password_confirm: password
    });

    const options = {
        hostname: '16.16.141.229',
        port: 8000,
        path: '/api/auth/register/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log("Registering user:", email);

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Registration Status:', res.statusCode);
            console.log('Registration Body:', data);

            if (res.statusCode >= 200 && res.statusCode < 300) {
                login(email, password);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Registration Error:', e);
    });

    req.write(postData);
    req.end();
};

const login = (email, password) => {
    const postData = JSON.stringify({
        email: email,
        password: password
    });

    const options = {
        hostname: '16.16.141.229',
        port: 8000,
        path: '/api/auth/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log("Logging in...");

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Login Status:', res.statusCode);
            console.log('Login Body Raw:', data);
        });
    });

    req.on('error', (e) => {
        console.error('Login Error:', e);
    });

    req.write(postData);
    req.end();
};

run();
