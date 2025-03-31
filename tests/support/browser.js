import {
	rollup
} from 'rollup';
import {
	loadConfigFile
} from 'rollup/loadConfigFile';
import {
	JSDOM
} from 'jsdom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function bundleKoCo ()
{
	const {
		options
	} = await loadConfigFile('rollup.config.js');

	const config = options.find(option => option.output[0].format === 'umd');

	let bundle;

	try
	{
		bundle = await rollup(config);

		const {
			output
		} = await bundle.generate(
			config.output[0]
		);

		return output[0].code;
	}
	finally
	{
		bundle?.close?.();
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function createBrowserWithKoCo ()
{
	const library = await bundleKoCo();

	const {
		window
	} = new JSDOM('', {
		runScripts : 'dangerously'
	});

	const script = window.document.createElement('script');

	script.innerHTML = `
		${library}
	`;

	window.document.head.appendChild(script);

	return window;
}
