/**
 * Pure helpers for the VerifyRuns node — no n8n imports, so they are unit-testable with `node --test`.
 */

export interface NodeParams {
	webhookUrl: string;
	/** What the workflow believes it wrote this run. `null` = don't claim. */
	wrote: number | null;
	/** Seconds to wait for the verdict. 0 = fire and forget. Capped at 60 by the server. */
	waitSeconds: number;
}

export interface BuiltRequest {
	url: string;
	method: 'POST';
	headers: Record<string, string>;
	body: Record<string, number> | undefined;
	json: true;
}

export interface VerdictResponse {
	accepted: boolean;
	run_id: string;
	verdict?: 'PASS' | 'FAIL' | null;
	diff_message?: string | null;
	timed_out?: boolean;
}

export function buildRequest(params: NodeParams): BuiltRequest {
	const base = params.webhookUrl.trim();
	if (!/^https?:\/\/.+\/api\/hook\/.+/.test(base)) {
		throw new Error('Webhook URL must look like https://<host>/api/hook/<secret> — copy it from the Check page.');
	}
	const wait = Math.max(0, Math.min(60, Math.floor(Number(params.waitSeconds) || 0)));
	const url = wait > 0 ? `${base}${base.includes('?') ? '&' : '?'}wait=${wait}` : base;
	const body = params.wrote === null || params.wrote === undefined ? undefined : { wrote: Math.max(0, Math.floor(params.wrote)) };
	return {
		url,
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body,
		json: true,
	};
}

/** The error message to fail the n8n execution with, or null when the run should continue. */
export function failureMessage(res: VerdictResponse, failOnFail: boolean): string | null {
	if (!failOnFail) return null;
	if (res.verdict === 'FAIL') {
		return `VerifyRuns: ${res.diff_message || 'the destination did not match what this workflow reported.'}`;
	}
	return null;
}
