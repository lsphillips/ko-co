import {
	rollup
} from 'rollup';
import {
	JSDOM
} from 'jsdom';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function loadLibrary ()
{
	let bundle;

	try
	{
		bundle = await rollup({
			input : 'src/ko-co.js'
		});

		const {
			output
		} = await bundle.generate({
			name    : 'library',
			format  : 'iife'
		});

		return output[0].code;
	}
	finally
	{
		bundle?.close?.();
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function createBrowserWithLibrary ()
{
	const koco = await loadLibrary();

	const {
		window
	} = new JSDOM('', {
		runScripts : 'dangerously'
	});

	const script = window.document.createElement('script');

	script.innerHTML = `
		${koco}
	`;

	window.document.head.appendChild(script);

	return window;
}
