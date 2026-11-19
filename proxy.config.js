const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const configPath = join(__dirname, 'src', 'assets', 'config', 'api-config.json');

function readEndpoint(setting) {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
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

const settings = ['apiBaseUrl', 'notificationHub'];
settings.forEach(readEndpoint);

function matchEndpoint(pathname, websocket) {
    for (const setting of settings) {
        const url = readEndpoint(setting);
        if (!url || (websocket && setting !== 'notificationHub')) {
            continue;
        }
        const basePath = url.pathname.replace(/\/$/, '');
        const requestPath = pathname.split('?')[0];
        if (requestPath === basePath || requestPath.startsWith(`${basePath}/`)) {
            return url;
        }
    }
    return null;
}

// Vite does not support Webpack's context/router callbacks. Match dynamically
// so runtime config edits still take effect without restarting the dev server.
module.exports = {
    '^/': {
        secure: true,
        changeOrigin: true,
        ws: true,
        configure: proxy => {
            for (const method of ['web', 'ws']) {
                const forward = proxy[method].bind(proxy);
                proxy[method] = (req, connection, optionsOrHead, options) => {
                    const url = matchEndpoint(req.url, method === 'ws');
                    if (!url) {
                        throw new Error(`Proxy endpoint changed while routing ${req.url}; retry the request.`);
                    }
                    // Use per-request targets so concurrent API/hub requests
                    // and overlapping endpoint paths cannot share stale targets.
                    if (method === 'ws') {
                        return forward(req, connection, optionsOrHead, { ...options, target: url.origin });
                    }
                    return forward(req, connection, { ...optionsOrHead, target: url.origin });
                };
            }
        },
        bypass: (req, res) => {
            if (req.headers['sec-websocket-protocol'] === 'vite-hmr') {
                return req.url;
            }
            return matchEndpoint(req.url, !res) ? undefined : req.url;
        }
    }
};
