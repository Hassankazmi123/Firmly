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

    console.log("Registering...");

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            console.log('Registration Status:', res.statusCode);
            if (res.statusCode >= 200 && res.statusCode < 300) {
                login(email, password);
            } else {
                console.log('Reg failed:', data);
            }
        });
    });

    req.on('error', (e) => console.error(e));
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
            try {
                const json = JSON.parse(data);
                console.log('Login properties:', Object.keys(json));
                if (json.data) console.log('Login.data properties:', Object.keys(json.data));

                if (json.access) console.log('Found "access" token');
                if (json.token) console.log('Found "token"');
                if (json.access_token) console.log('Found "access_token"');
            } catch (e) {
                console.log('Invalid JSON response:', data.substring(0, 100));
            }
        });
    });

    req.on('error', (e) => console.error(e));
    req.write(postData);
    req.end();
};

run();
