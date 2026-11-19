const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const { createRequire } = require('node:module');
const { createServer } = require('node:http');
const { once } = require('node:events');
const { pathToFileURL } = require('node:url');

const root = join(__dirname, '..');
const source = readFileSync(join(root, 'proxy.conf.js'), 'utf8');

function loadProxy(initialConfig) {
    let config = initialConfig;
    const context = {
        __dirname: root,
        module: { exports: {} },
        URL,
        require: name => name === 'node:fs'
            ? { readFileSync: () => JSON.stringify(config) }
            : require(name)
    };
    runInNewContext(source, context);
    let target;
    const proxy = {
        web: (req, res, options) => { target = options.target; },
        ws: (req, socket, head, options) => { target = options.target; }
    };
    context.module.exports['^/'].configure(proxy);
    return {
        proxies: context.module.exports,
        route: (pathname, websocket = false) => {
            const options = context.module.exports['^/'];
            const result = options.bypass({ url: pathname, headers: {} }, websocket ? undefined : {});
            if (typeof result === 'string') {
                return null;
            }
            if (websocket) {
                proxy.ws({ url: pathname }, {}, Buffer.alloc(0), {});
            } else {
                proxy.web({ url: pathname }, {}, {});
            }
            return target;
        },
        update: next => { config = next; }
    };
}

test('proxy updates API and hub hosts, ports and paths without reloading the module', () => {
    const runtime = loadProxy({
        apiBaseUrl: 'https://uat.example.test/api/v1/',
        notificationHub: 'https://uat.example.test/himshub'
    });
    runtime.update({
        apiBaseUrl: 'https://demo.example.test:8443/backend/v2/',
        notificationHub: 'https://events.example.test:9443/notifications'
    });
    assert.equal(runtime.route('/backend/v2/patients'), 'https://demo.example.test:8443');
    assert.equal(runtime.route('/api/v1/patients'), null);
    assert.equal(runtime.route('/backend/v20/patients'), null);
    assert.equal(runtime.route('/notifications/negotiate?negotiateVersion=1'), 'https://events.example.test:9443');
    assert.equal(runtime.route('/notifications', true), 'https://events.example.test:9443');
    assert.equal(runtime.route('/notifications-other'), null);
    assert.equal(runtime.route('/backend/v2/patients', true), null);
});

test('root-relative endpoints are not proxied', () => {
    const runtime = loadProxy({ apiBaseUrl: '/api/v1/', notificationHub: '/himshub' });
    assert.equal(runtime.route('/api/v1/check'), null);
    assert.equal(runtime.route('/himshub', true), null);
    runtime.update({ apiBaseUrl: 'https://demo.example.test/api/v1/', notificationHub: '/himshub' });
    assert.equal(runtime.route('/api/v1/check'), 'https://demo.example.test');
});

test('invalid edits fail explicitly rather than retaining the previous target', () => {
    const runtime = loadProxy({
        apiBaseUrl: 'https://demo.example.test/api/',
        notificationHub: 'https://demo.example.test/hub'
    });
    runtime.update({ apiBaseUrl: '', notificationHub: '/hub' });
    assert.throws(() => runtime.route('/api/check'), /Invalid apiBaseUrl/);
    assert.throws(() => loadProxy({ apiBaseUrl: 'https://example.test/api?x=1', notificationHub: '/hub' }), /query strings/);
});

test('production endpoints require HTTPS while localhost HTTP is allowed', () => {
    assert.doesNotThrow(() => loadProxy({
        apiBaseUrl: 'http://localhost:5251/api/v1/',
        notificationHub: 'http://[::1]:5251/himshub'
    }));
    assert.throws(() => loadProxy({
        apiBaseUrl: 'http://api.example.test/api/v1/',
        notificationHub: '/hub'
    }), /must use HTTPS/);
    assert.throws(() => loadProxy({
        apiBaseUrl: '/api/v1/',
        notificationHub: 'http://192.168.2.100:5251/himshub'
    }), /must use HTTPS/);
});

test('Vite HMR and frontend requests are not sent to the backend', () => {
    const runtime = loadProxy({ apiBaseUrl: 'https://example.test/api/', notificationHub: 'https://example.test/hub' });
    assert.equal(runtime.route('/dashboard/home'), null);
    assert.equal(runtime.route('/assets/config/api-config.json'), null);
    assert.equal(runtime.proxies['^/'].bypass({
        url: '/',
        headers: { 'sec-websocket-protocol': 'vite-hmr' }
    }), '/');
});

test('overlapping API and hub paths use the hub target for WebSockets', () => {
    const runtime = loadProxy({
        apiBaseUrl: 'https://api.example.test/api/',
        notificationHub: 'https://hub.example.test/api/hub'
    });
    assert.equal(runtime.route('/api/check'), 'https://api.example.test');
    assert.equal(runtime.route('/api/hub?id=test', true), 'https://hub.example.test');
});

test('real Vite proxy forwards concurrent HTTP requests and WebSockets after config edits', async t => {
    const buildRequire = createRequire(require.resolve('@angular/build/package.json'));
    const { createServer: createViteServer } = await import(pathToFileURL(buildRequire.resolve('vite')).href);
    const WebSocket = buildRequire('ws');
    const WebSocketServer = WebSocket.Server;
    async function listen(server) {
        server.listen(0, '127.0.0.1');
        await once(server, 'listening');
        t.after(() => new Promise(resolve => {
            server.close(resolve);
            server.closeAllConnections();
        }));
        return `http://127.0.0.1:${server.address().port}`;
    }
    const first = await listen(createServer((req, res) => res.end(`first:${req.url}`)));
    const secondServer = createServer((req, res) => res.end(`second:${req.url}`));
    const second = await listen(secondServer);
    const hubServer = createServer((req, res) => res.end(`hub:${req.url}`));
    const hub = await listen(hubServer);
    const websocketServer = new WebSocketServer({ server: hubServer });
    websocketServer.on('connection', (socket, req) => socket.send(`websocket:${req.url}`));
    t.after(() => new Promise(resolve => websocketServer.close(resolve)));
    const runtime = loadProxy({ apiBaseUrl: `${first}/api/v1/`, notificationHub: `${first}/hub` });
    const vite = await createViteServer({
        configFile: false,
        appType: 'custom',
        logLevel: 'silent',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { host: '127.0.0.1', port: 0, hmr: false, proxy: runtime.proxies }
    });
    t.after(() => vite.close());
    await vite.listen();
    const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
    assert.equal(await (await fetch(`${origin}/api/v1/check`)).text(), 'first:/api/v1/check');
    runtime.update({ apiBaseUrl: `${second}/backend/v2/`, notificationHub: `${hub}/events` });
    const responses = await Promise.all(Array.from({ length: 12 }, (_, index) =>
        fetch(`${origin}${index % 2 ? '/events/negotiate' : '/backend/v2/check'}`).then(res => res.text())));
    responses.forEach((text, index) => assert.equal(text, index % 2 ? 'hub:/events/negotiate' : 'second:/backend/v2/check'));
    assert.equal((await fetch(`${origin}/api/v1/check`)).status, 404);
    assert.equal((await fetch(`${origin}/backend/v20/check`)).status, 404);
    const websocket = new WebSocket(`${origin.replace('http:', 'ws:')}/events?id=test`);
    t.after(() => websocket.terminate());
    const [message] = await once(websocket, 'message');
    assert.equal(message.toString(), 'websocket:/events?id=test');
    websocket.close();
    await once(websocket, 'close');
});
