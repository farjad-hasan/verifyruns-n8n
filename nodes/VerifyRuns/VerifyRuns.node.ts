import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildRequest, failureMessage, noItemsMessage, type VerdictResponse } from './request';

export class VerifyRuns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VerifyRuns',
		name: 'verifyRuns',
		icon: 'file:verifyruns.svg',
		group: ['output'],
		version: 1,
		subtitle: 'Verify the destination after this workflow ran',
		description:
			'Tells VerifyRuns this workflow finished and what it wrote. VerifyRuns re-reads the destination and returns PASS or FAIL; optionally fail this execution when the destination disagrees.',
		defaults: { name: 'VerifyRuns' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
				placeholder: 'https://<host>/api/hook/<secret>',
				description: 'The Check\'s secret webhook URL from VerifyRuns. Treated as a secret.',
			},
			{
				displayName: 'Report What Was Written',
				name: 'reportWrote',
				type: 'boolean',
				default: true,
				description: 'Whether to tell VerifyRuns how many records this run wrote, so the verdict reconciles that number against the destination',
			},
			{
				displayName: 'Records Written',
				name: 'wrote',
				type: 'number',
				default: 0,
				displayOptions: { show: { reportWrote: [true] } },
				description: 'How many records this run wrote. Leave 0 to use the number of items reaching this node.',
			},
			{
				displayName: 'Wait for Verdict (Seconds)',
				name: 'waitSeconds',
				type: 'number',
				default: 30,
				typeOptions: { minValue: 0, maxValue: 60 },
				description: '0 sends the ping and continues immediately. Up to 60 waits for VerifyRuns to re-read the destination and returns the verdict.',
			},
			{
				displayName: 'Fail This Execution on FAIL',
				name: 'failOnFail',
				type: 'boolean',
				default: true,
				displayOptions: { hide: { waitSeconds: [0] } },
				description: 'Whether a FAIL verdict throws, turning this execution red with VerifyRuns\' diff message as the error',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const noItems = noItemsMessage(items.length);
		if (noItems) throw new NodeOperationError(this.getNode(), noItems);
		const webhookUrl = this.getNodeParameter('webhookUrl', 0) as string;
		const reportWrote = this.getNodeParameter('reportWrote', 0) as boolean;
		const wroteParam = reportWrote ? (this.getNodeParameter('wrote', 0) as number) : null;
		const waitSeconds = this.getNodeParameter('waitSeconds', 0) as number;
		const failOnFail = waitSeconds > 0 ? (this.getNodeParameter('failOnFail', 0) as boolean) : false;

		const wrote = wroteParam === null ? null : wroteParam > 0 ? wroteParam : items.length;
		const req = buildRequest({ webhookUrl, wrote, waitSeconds });

		const res = (await this.helpers.httpRequest({
			method: req.method,
			url: req.url,
			headers: req.headers,
			body: req.body,
			json: true,
		})) as VerdictResponse;

		const message = failureMessage(res, failOnFail);
		if (message) {
			throw new NodeOperationError(this.getNode(), message, { description: `Run ${res.run_id}` });
		}

		return [[{ json: { ...res, wrote } }]];
	}
}
