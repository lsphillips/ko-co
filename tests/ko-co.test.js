import {
	setTimeout
} from 'node:timers/promises';
import {
	describe,
	it,
	before,
	beforeEach,
	afterEach
} from 'node:test';
import assert from 'node:assert';
import {
	createBrowserWithKoCo
} from './support/browser.js';
import EventCapturer from './support/event-capturer.js';
import Keyboard from './support/keyboard.js';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

describe('koco', function ()
{
	let window, capturer, keyboard, koco, removeSupportForTheKonamiCode;

	before(async function ()
	{
		// Setup browser.
		window = await createBrowserWithKoCo();

		// Setup KoCo.
		koco = window.koco;

		// Setup event capturer.
		capturer = new EventCapturer('konamicode', window);

		// Setup keyboard.
		keyboard = new Keyboard(window);
	});

	beforeEach(function ()
	{
		capturer.start();
	});

	afterEach(function ()
	{
		// Clean up browser DOM.
		window.document.body.innerHTML = '';

		// Stop KoCo.
		removeSupportForTheKonamiCode();

		// Reset event capturer.
		capturer.reset().stop();
	});

	describe('addSupportForTheKonamiCode(options)', function ()
	{
		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered correctly', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			const events = capturer.getCapturedEvents();

			// Assert.
			assert.strictEqual(events.length, 1);

			// Assert.
			assert.ok(events[0] instanceof window.CustomEvent);

			// Assert.
			assert.strictEqual(events[0].bubbles, true);
			assert.strictEqual(events[0].cancelable, true);

			// Assert.
			assert.strictEqual(events[0].target, window.document);
		});

		it('shall enable the `konamicode` event to even be emitted when the user has their caps lock enabled', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'B',
				'A'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 1);
		});

		it('shall enable the `konamicode` event to be emitted by the element that the user used to enter the Konami Code', function ()
		{
			// Setup.
			window.document.body.innerHTML = `
				<input type="text" />
			`;

			// Setup.
			const input = window.document.querySelector('input');

			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			], input);

			const events = capturer.getCapturedEvents();

			// Assert.
			assert.strictEqual(events.length, 1);

			// Assert.
			assert.strictEqual(events[0].target, input);
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered followed by the Enter key when `options.requireEnterPress` is `true`', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode({
				requireEnterPress : true
			});

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 0);

			// Act.
			keyboard.performKeyPresses([
				'Enter'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 1);
		});

		it('shall enable the `konamicode` event to even be emitted when the user takes a long time between any of the keys in the Konami Code sequence', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp'
			]);

			// Wait.
			await setTimeout(4500);

			// Act.
			keyboard.performKeyPresses([
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 1);
		});

		it('shall enable the `konamicode` event to only be emitted when the Konami Code sequence is not interrupted by an unexpected key (progress will be reset)', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode();

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'c',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 0);

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 1);
		});

		it('shall enable the `konamicode` event to only be emitted when the user does not take any longer than the number of milliseconds specified by `options.allowedTimeBetweenKeys` between any of the keys in the Konami Code sequence (progress will be reset)', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = koco.addSupportForTheKonamiCode({
				allowedTimeBetweenKeys : 1000
			});

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp'
			]);

			// Wait.
			await setTimeout(1500);

			// Act.
			keyboard.performKeyPresses([
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 0);

			// Act.
			keyboard.performKeyPresses([
				'ArrowUp',
				'ArrowUp',
				'ArrowDown',
				'ArrowDown',
				'ArrowLeft',
				'ArrowRight',
				'ArrowLeft',
				'ArrowRight',
				'b',
				'a'
			]);

			// Assert.
			assert.strictEqual(capturer.getCapturedEventCount(), 1);
		});
	});
});
