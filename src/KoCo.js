'use strict';

/**
 * The legendary Konami Code sequence.
 *
 * @private
 *
 * @static
 *
 * @final
 *
 * @type {Array.<String>}
 *
 * @memberof KoCo
 */
const KONAMI_CODE_SEQUENCE = [
	'arrowup',
	'arrowup',
	'arrowdown',
	'arrowdown',
	'arrowleft',
	'arrowright',
	'arrowleft',
	'arrowright',
	'b',
	'a'
];

// --------------------------------------------------------

/**
 * Triggers a custom event on the document that bubbles.
 *
 * @private
 *
 * @static
 *
 * @param {EventTarget} target   The target that will dispatch the event.
 * @param {String}      type     The event type.
 * @param {Object}      [detail] The data that will be assigned to the `event.detail` property.
 *
 * @memberof KoCo
 */
function triggerEvent (target, type, detail = {})
{
	let event, bubbles = true, cancelable = true;

	if (typeof window.CustomEvent === 'function')
	{
		event = new window.CustomEvent(type, {
			detail, bubbles, cancelable
		});
	}
	else
	{
		event = document.createEvent('CustomEvent');

		// Initialize the old fashioned way.
		event.initCustomEvent(type, bubbles, cancelable, detail);
	}

	target.dispatchEvent(event);
}

// --------------------------------------------------------

/**
 * Adds support for the Konami Code by allowing elements to emit a `konamicode` event when the user enters the `↑ ↑ ↓ ↓ ← → ← → B A` sequence.
 *
 * This will likely be called in your application entry point, for example:
 *
 * ```
 * KoCo.addSupportForTheKonamiCode(
 * {
 *    allowedTimeBetweenKeys : 500
 * });
 * ```
 *
 * Elsewhere, you can then listen for the Konami Code:
 *
 * ```
 * anEventTarget.addEventListener('konamicode', function ()
 * {
 *    console.log('The Konami Code has been entered. 30 more lives for you!');
 * });
 * ```
 *
 * The `konamicode` event bubbles, so event delegation works as expected.
 *
 * @static
 *
 * @param {Object}  [options]                           Some options to control how the Konami Code sequence is detected.
 * @param {Number}  [options.allowedTimeBetweenKeys]    Determines the maximum allowed time (in milliseconds) between key presses before sequence progress is reset. By default the user can take as long as they want.
 * @param {Boolean} [options.requireEnterPress = false] Determines whether the user needs to press enter before the Konami Code is triggered.
 *
 * @returns {Function} A function that will remove support for the Konami Code.
 *
 * @memberof KoCo
 */
function addSupportForTheKonamiCode ({ requireEnterPress = false, allowedTimeBetweenKeys = 0 } = {})
{
	let sequence = KONAMI_CODE_SEQUENCE, timer = null, progress = 0;

	if (requireEnterPress)
	{
		sequence = [...KONAMI_CODE_SEQUENCE, 'enter'];
	}

	function konamiCodeSequenceListener (event)
	{
		if (timer)
		{
			clearTimeout(timer);
		}

		if (sequence[progress] !== event.key.toLowerCase())
		{
			timer    = null;
			progress = 0;

			return;
		}

		++progress;

		if (sequence.length === progress)
		{
			timer    = null;
			progress = 0;

			triggerEvent(event.target, 'konamicode', {
			});

			return;
		}

		if (allowedTimeBetweenKeys > 0)
		{
			timer = setTimeout(function resetSequenceIfUserTakesTooLong ()
			{
				timer    = null;
				progress = 0;

			}, allowedTimeBetweenKeys);
		}
	}

	// Listen.
	document.addEventListener('keydown', konamiCodeSequenceListener, true);

	return function removeSupportForTheKonamiCode ()
	{
		document.removeEventListener('keydown', konamiCodeSequenceListener, true);
	};
}

// --------------------------------------------------------

module.exports = { addSupportForTheKonamiCode };
