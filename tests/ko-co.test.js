import wait                    from 'timeout-as-promise';
import performKeyPress         from './support/perform-key-press.js';
import KonamiCodeEventCapturer from './support/konami-code-event-capturer.js';
import * as koco               from '../src/ko-co.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

describe('koco', function ()
{
	let capturer, removeSupportForTheKonamiCode;

	before(function ()
	{
		capturer = new KonamiCodeEventCapturer();

		// Inject.
		document.body.innerHTML = `
			<input type="text" />
		`;
	});

	beforeEach(function ()
	{
		capturer.start();
	});

	afterEach(function ()
	{
		capturer.stop().reset();

		// Clean up.
		removeSupportForTheKonamiCode();
	});

	describe('addSupportForTheKonamiCode(options)', function ()
	{
		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered correctly', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasCapturedEvent();
		});

		it('shall enable the `konamicode` event to even be emitted when the user has their caps lock enabled', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('B');
			performKeyPress('A');

			// Assert.
			capturer.hasCapturedEvent();
		});

		it('shall enable the `konamicode` event to be emitted by the element that the user used to enter the Konami Code', function ()
		{
			let textField = document.querySelector('input');

			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp',    textField);
			performKeyPress('ArrowUp',    textField);
			performKeyPress('ArrowDown',  textField);
			performKeyPress('ArrowDown',  textField);
			performKeyPress('ArrowLeft',  textField);
			performKeyPress('ArrowRight', textField);
			performKeyPress('ArrowLeft',  textField);
			performKeyPress('ArrowRight', textField);
			performKeyPress('b',          textField);
			performKeyPress('a',          textField);

			// Assert.
			capturer.hasCapturedEvent({
				dispatchedBy : textField
			});
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered followed by the Enter key when `options.requireEnterPress` is `true`', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode({
				requireEnterPress : true
			});

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasNotCapturedEvent();

			// Act.
			performKeyPress('Enter');

			// Assert.
			capturer.hasCapturedEvent();
		});

		it('shall enable the `konamicode` event to even be emitted when the user takes a long time between any of the keys in the Konami Code sequence', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');

			// Wait.
			await wait(4500);

			// Act.
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasCapturedEvent();
		});

		it('shall enable the `konamicode` event to only be emitted when the Konami Code sequence is not interrupted by an unexpected key (progress will be reset)', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('c');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasNotCapturedEvent();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasCapturedEvent();
		});

		it('shall enable the `konamicode` event to only be emitted when the user does not take any longer than the number of milliseconds specified by `options.allowedTimeBetweenKeys` between any of the keys in the Konami Code sequence (progress will be reset)', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode({
				allowedTimeBetweenKeys : 1000
			});

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');

			// Wait.
			await wait(1500);

			// Act.
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasNotCapturedEvent();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowDown');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('ArrowLeft');
			performKeyPress('ArrowRight');
			performKeyPress('b');
			performKeyPress('a');

			// Assert.
			capturer.hasCapturedEvent();
		});
	});
});
