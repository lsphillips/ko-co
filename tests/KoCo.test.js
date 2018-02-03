'use strict';

// Dependencies
// --------------------------------------------------------

const { assert, spy } = require('sinon');
const delay           = require('timeout-as-promise');

// Helpers
// --------------------------------------------------------

const performKeyPress = require('./helpers/performKeyPress');

// Matchers
// --------------------------------------------------------

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
	});

	beforeEach(function ()
	{
		onKonamiCode.reset();
	});

	afterEach(function ()
	{
		removeSupportForTheKonamiCode();
	});

	describe('.addSupportForTheKonamiCode(options)', function ()
	{
		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered correctly', function ()
		{
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

		it('shall enable the `konamicode` event to be emitted by the element that the user used to enter the Konami Code', function ()
		{
			let anExampleInput = document.createElement('input');

			document.body.appendChild(anExampleInput);

			// Setup.
			removeSupportForTheKonamiCode = KoCo.addSupportForTheKonamiCode();

			// Act.
			performKeyPress('ArrowUp',    anExampleInput);
			performKeyPress('ArrowUp',    anExampleInput);
			performKeyPress('ArrowDown',  anExampleInput);
			performKeyPress('ArrowDown',  anExampleInput);
			performKeyPress('ArrowLeft',  anExampleInput);
			performKeyPress('ArrowRight', anExampleInput);
			performKeyPress('ArrowLeft',  anExampleInput);
			performKeyPress('ArrowRight', anExampleInput);
			performKeyPress('b',          anExampleInput);
			performKeyPress('a',          anExampleInput);

			// Assert.
			assert.calledWith(onKonamiCode, matchKonamiCodeEvent({
				dispatchBy : anExampleInput
			}));
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence followed by the Enter key is entered when `options.requireEnterPress` is `true`', function ()
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

			// Setup.
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
