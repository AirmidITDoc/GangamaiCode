const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const configPath = join(__dirname, 'src', 'assets', 'config', 'api-config.json');

function readEndpoint(setting) {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const value = config[setting];
    if (typeof value !== 'string' || !/^(https?:\/\/|\/(?!\/))/i.test(value.trim())) {
        throw new Error(`Invalid ${setting} in ${configPath}: expected an HTTP(S) or root-relative URL.`);
    }
    const resolvedValue = value.trim().replace('{hostname}', process.env.HIMS_API_HOST || 'localhost');
    const url = new URL(resolvedValue, 'http://localhost');
    if (url.search || url.hash) {
        throw new Error(`Invalid ${setting} in ${configPath}: query strings and fragments are not supported.`);
    }
    if (url.protocol === 'http:' && !isLoopbackOrPrivateHost(url.hostname)) {
        throw new Error(`Invalid ${setting} in ${configPath}: public endpoints must use HTTPS; HTTP is allowed only for localhost or private network addresses.`);
    }

    function isLoopbackOrPrivateHost(hostname) {
        const host = hostname.replace(/^\[|\]$/g, '');
        if (host === 'localhost' || host === '::1' || host === '0:0:0:0:0:0:0:1') return true;
        return /^127(?:\.\d{1,3}){3}$/.test(host)
            || /^10(?:\.\d{1,3}){3}$/.test(host)
            || /^169\.254(?:\.\d{1,3}){2}$/.test(host)
            || /^172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}$/.test(host)
            || /^192\.168(?:\.\d{1,3}){2}$/.test(host)
            || /^(?:fc|fd|fe8|fe9|fea|feb)[0-9a-f:]*$/i.test(host);
    }
    return /^https?:\/\//i.test(resolvedValue) ? url : null;
}

function createProxy(setting, websocket) {
    const endpoint = readEndpoint(setting);
    if (!endpoint) {
        return {};
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
