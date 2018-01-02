'use strict';

// Dependencies
// --------------------------------------------------------

const sinon     = require('sinon');
const { JSDOM } = require('jsdom');

// Subjects
// --------------------------------------------------------

const KoCo = require('../src/KoCo');

// --------------------------------------------------------

const matchKonamiCodeEvent = sinon.match(value =>
{
	return value instanceof window.CustomEvent && value.type === 'konamicode';

}, 'Konami Code Event');

// --------------------------------------------------------

function triggerKeyboardPress (key, target = document)
{
	target.dispatchEvent(
		new window.KeyboardEvent('keydown', { key })
	);
}

// --------------------------------------------------------

describe('KoCo', function ()
{
	beforeEach(function ()
	{
		let browser = new JSDOM(`
			<html>
				<head>
					<title> The Konami Code Test Page </title>
				</head>
				<body>
					<input type="text" id="konami-code-text-field" />
				</body>
			</html>
		`);

		// Expose.
		global.window   = browser.window;
		global.document = browser.window.document;
	});

	afterEach(function ()
	{
		// Close.
		global.window.close();

		// Clear.
		delete global.window;
		delete global.document;
		delete global.navigator;
	});

	describe('.addSupportForTheKonamiCode(options)', function ()
	{
		beforeEach(function ()
		{
			sinon.spy(document, 'dispatchEvent');
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence is entered correctly', function ()
		{
			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);
		});

		it('shall enable the `konamicode` event to be emitted by the element that the user used to enter the Konami Code', function ()
		{
			let theKonamiCodeTextField = document.getElementById('konami-code-text-field');

			// Spy.
			sinon.spy(theKonamiCodeTextField, 'dispatchEvent');

			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp',    theKonamiCodeTextField);
			triggerKeyboardPress('ArrowUp',    theKonamiCodeTextField);
			triggerKeyboardPress('ArrowDown',  theKonamiCodeTextField);
			triggerKeyboardPress('ArrowDown',  theKonamiCodeTextField);
			triggerKeyboardPress('ArrowLeft',  theKonamiCodeTextField);
			triggerKeyboardPress('ArrowRight', theKonamiCodeTextField);
			triggerKeyboardPress('ArrowLeft',  theKonamiCodeTextField);
			triggerKeyboardPress('ArrowRight', theKonamiCodeTextField);
			triggerKeyboardPress('b',          theKonamiCodeTextField);
			triggerKeyboardPress('a',          theKonamiCodeTextField);

			// Assert.
			sinon.assert.calledWith(theKonamiCodeTextField.dispatchEvent, matchKonamiCodeEvent);
		});

		it('shall enable the `konamicode` event that can bubble', function ()
		{
			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.calledWith(
				document.dispatchEvent, sinon.match.has('bubbles', true)
			);
		});

		it('shall enable the `konamicode` event that can be cancelled', function ()
		{
			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.calledWith(
				document.dispatchEvent, sinon.match.has('cancelable', true)
			);
		});

		it('shall enable the `konamicode` event to be emitted every time the Konami Code sequence followed by the Enter key is entered when `options.requireEnterPress` is `true`', function ()
		{
			// Act.
			KoCo.addSupportForTheKonamiCode({
				requireEnterPress : true
			});

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.neverCalledWith(document.dispatchEvent, matchKonamiCodeEvent);

			// Setup.
			triggerKeyboardPress('Enter');

			// Assert.
			sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');
			triggerKeyboardPress('Enter');

			// Assert.
			sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);
		});

		it('shall enable the `konamicode` event to even be emitted when the user takes a long time between any of the keys in the Konami Code sequence', function (done)
		{
			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');

			// Setup.
			setTimeout(function ()
			{
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('b');
				triggerKeyboardPress('a');

				// Assert.
				sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);

				done();

			}, 4500);
		});

		it('shall enable the `konamicode` event to only be emitted when the Konami Code sequence is not interrupted by an unexpected key (progress will be reset)', function ()
		{
			// Act.
			KoCo.addSupportForTheKonamiCode();

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('c');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.neverCalledWith(document.dispatchEvent, matchKonamiCodeEvent);

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowDown');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('ArrowLeft');
			triggerKeyboardPress('ArrowRight');
			triggerKeyboardPress('b');
			triggerKeyboardPress('a');

			// Assert.
			sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);
		});

		it('shall enable the `konamicode` event to only be emitted when the user does not take any longer than the number of milliseconds specified by `options.allowedTimeBetweenKeys` between any of the keys in the Konami Code sequence (progress will be reset)', function (done)
		{
			// Act.
			KoCo.addSupportForTheKonamiCode({
				allowedTimeBetweenKeys : 1000
			});

			// Setup.
			triggerKeyboardPress('ArrowUp');
			triggerKeyboardPress('ArrowUp');

			// Setup.
			setTimeout(function ()
			{
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('b');
				triggerKeyboardPress('a');

				// Assert.
				sinon.assert.neverCalledWith(document.dispatchEvent, matchKonamiCodeEvent);

				// Setup.
				triggerKeyboardPress('ArrowUp');
				triggerKeyboardPress('ArrowUp');
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowDown');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('ArrowLeft');
				triggerKeyboardPress('ArrowRight');
				triggerKeyboardPress('b');
				triggerKeyboardPress('a');

				// Assert.
				sinon.assert.calledWith(document.dispatchEvent, matchKonamiCodeEvent);

				done();

			}, 1500);
		});
	});
});
