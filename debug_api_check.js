const fetch = require('node-fetch'); // unlikely to be available in CRA env directly without install, but let's try https or http if needed. 
// Actually standard node doesn't have fetch before v18.
// I will use 'http' module or check if I can use the project's dependencies.
// The project has package.json with dependencies.
// It keeps it simple to use standard https/http.

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
            'Content-Length': postData.length
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
            'Content-Length': postData.length
        }
    };

    console.log("\nLogging in...");

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Login Status:', res.statusCode);
            console.log('Login Body Raw:', data);
            try {
                const json = JSON.parse(data);
                console.log('Login Body JSON keys:', Object.keys(json));
                if (json.data) console.log('Login Body.data keys:', Object.keys(json.data));
            } catch (e) {
                console.log('Could not parse JSON');
            }
        });
    });

    req.on('error', (e) => {
        console.error('Login Error:', e);
    });

    req.write(postData);
    req.end();
};

run();
