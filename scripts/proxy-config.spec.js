const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const root = join(__dirname, '..');
const source = readFileSync(join(root, 'proxy.conf.js'), 'utf8');

function loadProxy(config, env = {}) {
    const context = {
        __dirname: root,
        module: { exports: {} },
        URL,
        process: { env },
        require: name => name === 'node:fs'
            ? { readFileSync: () => JSON.stringify(config) }
            : require(name)
    };
    runInNewContext(source, context);
    return context.module.exports;
}

function route(proxies, pathname) {
    const requestPath = pathname.split('?')[0];
    const context = Object.keys(proxies)
        .filter(key => requestPath === key || requestPath.startsWith(`${key}/`))
        .sort((first, second) => second.length - first.length)[0];
    return context ? proxies[context] : null;
}

test('creates webpack-compatible API and SignalR proxy entries', () => {
    const proxies = loadProxy({
        apiBaseUrl: 'https://api.example.test/backend/v2/',
        notificationHub: 'https://events.example.test:9443/notifications'
    });
    assert.deepEqual(Object.keys(proxies).sort(), ['/backend/v2', '/notifications']);
    assert.deepEqual(
        { ...route(proxies, '/backend/v2/patients') },
        {
            target: 'https://api.example.test',
            secure: true,
            changeOrigin: true,
            ws: false
        }
    );
    assert.equal(route(proxies, '/notifications/negotiate').target, 'https://events.example.test:9443');
    assert.equal(route(proxies, '/notifications?id=test').ws, true);
    assert.equal(route(proxies, '/backend/v20/patients'), null);
});

test('root-relative endpoints are not proxied', () => {
    const proxies = loadProxy({ apiBaseUrl: '/api/v1/', notificationHub: '/himshub' });
    assert.equal(Object.keys(proxies).length, 0);
});

test('invalid endpoint configuration fails during proxy startup', () => {
    assert.throws(() => loadProxy({ apiBaseUrl: '', notificationHub: '/hub' }), /Invalid apiBaseUrl/);
    assert.throws(() => loadProxy({
        apiBaseUrl: 'https://example.test/api?x=1',
        notificationHub: '/hub'
    }), /query strings/);
});

test('public endpoints require HTTPS while local network HTTP is allowed', () => {
    assert.doesNotThrow(() => loadProxy({
        apiBaseUrl: 'http://localhost:5251/api/v1/',
        notificationHub: 'http://[::1]:5251/himshub'
    }));
    assert.doesNotThrow(() => loadProxy({
        apiBaseUrl: 'http://192.168.40.20:5251/api/v1/',
        notificationHub: 'http://10.20.30.40:5251/himshub'
    }));
    assert.throws(() => loadProxy({
        apiBaseUrl: 'http://api.example.test/api/v1/',
        notificationHub: '/hub'
    }), /must use HTTPS/);
});

test('hostname templates default to localhost and support an environment override', () => {
    const local = loadProxy({
        apiBaseUrl: 'http://{hostname}:9091/api/v1/',
        notificationHub: 'http://{hostname}:9091/himshub'
    });
    assert.equal(route(local, '/api/v1/check').target, 'http://localhost:9091');

    const lan = loadProxy({
        apiBaseUrl: 'http://{hostname}:9091/api/v1/',
        notificationHub: 'http://{hostname}:9091/himshub'
    }, { HIMS_API_HOST: '172.20.0.15' });
    assert.equal(route(lan, '/api/v1/check').target, 'http://172.20.0.15:9091');
    assert.equal(route(lan, '/himshub/negotiate').target, 'http://172.20.0.15:9091');
});
