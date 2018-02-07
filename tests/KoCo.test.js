'use strict';

// Dependencies
// --------------------------------------------------------

const { assert, spy } = require('sinon');
const delay           = require('timeout-as-promise');

// Helpers & Matchers
// --------------------------------------------------------

const performKeyPress      = require('./support/performKeyPress');
const matchKonamiCodeEvent = require('./matchers/matchKonamiCodeEvent');

// Subjects
// --------------------------------------------------------

const KoCo = require('../src/KoCo');

// --------------------------------------------------------

describe('KoCo', function ()
{
	let onKonamiCode, removeSupportForTheKonamiCode;

	before(function ()
	{
		onKonamiCode = spy();

		// Listen.
		document.addEventListener('konamicode', onKonamiCode, false);

		// Inject.
		document.body.innerHTML = `
			<input type="text" />
		`;
	});

	beforeEach(function ()
	{
		onKonamiCode.resetHistory();
	});

	afterEach(function ()
	{
		removeSupportForTheKonamiCode();
	});

	describe('.addSupportForTheKonamiCode(options)', function ()
	{
		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered correctly', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});

		it('shall enable the `konamicode` event to even be emitted when the user has their caps lock enabled', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});

		it('shall enable the `konamicode` event to be emitted by the element that the user used to enter the Konami Code', function ()
		{
			let textField = document.querySelector('input');

			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent({
				dispatchBy : textField
			}));
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered followed by the Enter key when `options.requireEnterPress` is `true`', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode({
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
			assert.notCalled(onKonamiCode);

			// Act.
			performKeyPress('Enter');

			// Assert.
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});

		it('shall enable the `konamicode` event to even be emitted when the user takes a long time between any of the keys in the Konami Code sequence', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');

			// Wait.
			await delay(4500);

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});

		it('shall enable the `konamicode` event to only be emitted when the Konami Code sequence is not interrupted by an unexpected key (progress will be reset)', function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

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
			assert.notCalled(onKonamiCode);

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});

		it('shall enable the `konamicode` event to only be emitted when the user does not take any longer than the number of milliseconds specified by `options.allowedTimeBetweenKeys` between any of the keys in the Konami Code sequence (progress will be reset)', async function ()
		{
			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode({
				allowedTimeBetweenKeys : 1000
			});

			// Act.
			performKeyPress('ArrowUp');
			performKeyPress('ArrowUp');

			// Wait.
			await delay(1500);

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
			assert.notCalled(onKonamiCode);

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
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent());
		});
	});
});
