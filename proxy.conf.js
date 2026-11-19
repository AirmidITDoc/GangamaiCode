const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const configPath = join(__dirname, 'src', 'assets', 'config', 'api-config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

function readEndpoint(setting) {
    const value = config[setting];
    if (typeof value !== 'string' || !/^(https?:\/\/|\/(?!\/))/i.test(value.trim())) {
        throw new Error(`Invalid ${setting} in ${configPath}: expected an HTTP(S) or root-relative URL.`);
    }

    const url = new URL(value.trim(), 'http://localhost');
    if (url.search || url.hash) {
        throw new Error(`Invalid ${setting} in ${configPath}: query strings and fragments are not supported.`);
    }
    if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        throw new Error(`Invalid ${setting} in ${configPath}: production endpoints must use HTTPS; HTTP is allowed only for localhost.`);
    }
    return /^https?:\/\//i.test(value.trim()) ? url : null;
}

function createProxy(setting, websocket) {
    const endpoint = readEndpoint(setting);
    if (!endpoint) {
        return null;
    }

    const basePath = endpoint.pathname.replace(/\/$/, '');
    return {
        [basePath]: {
            target: endpoint.origin,
            secure: endpoint.protocol === 'https:',
            changeOrigin: true,
            ws: websocket
        }
    };
}

module.exports = Object.assign(
    {},
    createProxy('apiBaseUrl', false),
    createProxy('notificationHub', true)
);
