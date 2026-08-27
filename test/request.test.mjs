import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequest, failureMessage } from '../dist/nodes/VerifyRuns/request.js';

const URL = 'https://verifyruns.example.com/api/hook/abc123';

test('fire-and-forget: no wait param, no body when not claiming', () => {
	const r = buildRequest({ webhookUrl: URL, wrote: null, waitSeconds: 0 });
	assert.equal(r.url, URL);
	assert.equal(r.method, 'POST');
	assert.equal(r.body, undefined);
});

test('claims the written count as {wrote: N}', () => {
	const r = buildRequest({ webhookUrl: URL, wrote: 3, waitSeconds: 0 });
	assert.deepEqual(r.body, { wrote: 3 });
});

test('wait adds ?wait= and is capped at 60', () => {
	assert.equal(buildRequest({ webhookUrl: URL, wrote: null, waitSeconds: 30 }).url, `${URL}?wait=30`);
	assert.equal(buildRequest({ webhookUrl: URL, wrote: null, waitSeconds: 999 }).url, `${URL}?wait=60`);
	assert.equal(buildRequest({ webhookUrl: `${URL}?x=1`, wrote: null, waitSeconds: 5 }).url, `${URL}?x=1&wait=5`);
});

test('negative or fractional counts are floored at 0', () => {
	assert.deepEqual(buildRequest({ webhookUrl: URL, wrote: -2, waitSeconds: 0 }).body, { wrote: 0 });
	assert.deepEqual(buildRequest({ webhookUrl: URL, wrote: 2.9, waitSeconds: 0 }).body, { wrote: 2 });
});

test('rejects a URL that is not a VerifyRuns webhook', () => {
	assert.throws(() => buildRequest({ webhookUrl: 'https://example.com/other', wrote: null, waitSeconds: 0 }), /Webhook URL must look like/);
});

test('failureMessage: FAIL with fail-on-fail throws with the diff message', () => {
	const res = { accepted: true, run_id: 'r1', verdict: 'FAIL', diff_message: 'Run reported success, but the destination gained 0 records (expected at least 1).' };
	assert.equal(failureMessage(res, true), `VerifyRuns: ${res.diff_message}`);
	assert.equal(failureMessage(res, false), null);
});

test('failureMessage: PASS, null verdict (timed out) and missing verdict never throw', () => {
	assert.equal(failureMessage({ accepted: true, run_id: 'r', verdict: 'PASS' }, true), null);
	assert.equal(failureMessage({ accepted: true, run_id: 'r', verdict: null, timed_out: true }, true), null);
	assert.equal(failureMessage({ accepted: true, run_id: 'r' }, true), null);
});
