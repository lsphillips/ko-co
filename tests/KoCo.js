/* eslint-env mocha */

'use strict';

// Dependencies
// --------------------------------------------------------

const sinon = require('sinon');
const jsdom = require('jsdom');

// Create a custom matcher for a Konami Code custom event
// object, as we will be asserting for this a lot.
// --------------------------------------------------------

const matchKonamiCodeEvent = sinon.match(function (value)
{
    return value instanceof window.CustomEvent && value.type === 'konamicode';

}, 'Konami Code Event');

// --------------------------------------------------------

function triggerKeyboardPress (key, target = document)
{
    target.dispatchEvent(
        new window.KeyboardEvent('keydown',
        {
            key
        })
    );
}

// --------------------------------------------------------

describe('KoCo', function ()
{
    const KoCo = require('../src/KoCo');

    // ----------------------------------------------------

    beforeEach(function (done)
    {
        jsdom.env(
        {
            html :
            `
                <html>
                    <head>
                        <title> The Konami Code Test Page </title>
                    </head>
                    <body>
                        <input type="text" id="konami" />
                    </body>
                </html>
            `,

            done : (error, window) =>
            {
                if (error)
                {
                    done(
                        new Error(`Could not create a JSDOM window. ${error}`)
                    );

                    return;
                }

                // Expose `document`, `window` & `navigator` as globals
				// to emulate a browser environment.
				global.document  = window.document;
				global.window    = window;
				global.navigator = window.navigator;

                done();
            }
        });
    });

    // ----------------------------------------------------

    afterEach(function ()
    {
        // Close.
        global.window.close();

        // Clear.
        delete global.window;
        delete global.document;
        delete global.navigator;
    });

    // ----------------------------------------------------

    describe('.addSupportForTheKonamiCode(options)', function ()
    {
        beforeEach(function ()
        {
            sinon.spy(document, 'dispatchEvent');
        });

        // ------------------------------------------------

        context('shall enable the `konamicode` custom event to be emitted', function ()
        {
            it('every time the Konami Code sequence is entered correctly', function ()
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

            // --------------------------------------------

            it('by the element that the user used to enter the Konami Code', function ()
            {
                let theKonamiCodeTextField = document.getElementById('konami');

                // Spy.
                sinon.spy(theKonamiCodeTextField, 'dispatchEvent');

                // Act.
                KoCo.addSupportForTheKonamiCode();

                // Setup.
                triggerKeyboardPress('ArrowUp'   , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowUp'   , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowDown' , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowDown' , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowLeft' , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowRight', theKonamiCodeTextField);
                triggerKeyboardPress('ArrowLeft' , theKonamiCodeTextField);
                triggerKeyboardPress('ArrowRight', theKonamiCodeTextField);
                triggerKeyboardPress('b'         , theKonamiCodeTextField);
                triggerKeyboardPress('a'         , theKonamiCodeTextField);

                // Assert.
                sinon.assert.calledWith(theKonamiCodeTextField.dispatchEvent, matchKonamiCodeEvent);
            });

            // --------------------------------------------

            it('that bubbles', function ()
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

            // --------------------------------------------

            it('every time the Konami Code sequence followed by the Enter key is entered when `options.requireEnterPress` is `true`', function ()
            {
                // Act.
                KoCo.addSupportForTheKonamiCode(
                {
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

            // --------------------------------------------

            it('even when the user takes a long time to enter the next key in the Konami Code sequence', function (done)
            {
                this.timeout(5000);

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

            // --------------------------------------------

            it('but not when the Konami Code sequence is interrupted by an unexpected key (progress will be reset)', function ()
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

            // --------------------------------------------

            it('but not when the user takes longer than the number of milliseconds specified by `options.allowedTimeBetweenKeys` to enter the next key in the Konami Code sequence (progress will be reset)', function (done)
            {
                // Act.
                KoCo.addSupportForTheKonamiCode(
                {
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
});
