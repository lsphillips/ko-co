'use strict';

// --------------------------------------------------------

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
const KONAMI_CODE_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

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
	let event;

	if (typeof window.CustomEvent === 'function')
	{
		event = new window.CustomEvent(type,
		{
			detail, bubbles : true
		});
	}
	else
	{
		event = document.createEvent('CustomEvent');

		// Initialize the old fashioned way.
		event.initCustomEvent(type, true, false, detail);
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
 * @memberof KoCo
 */
function addSupportForTheKonamiCode (options = {})
{
	let timer = null, progress = 0, { requireEnterPress = false, allowedTimeBetweenKeys = 0 } = options;

	// Add the `Enter` key code to the sequence if it is
	// configured.
	let sequence = requireEnterPress ? [...KONAMI_CODE_SEQUENCE, 'Enter'] : KONAMI_CODE_SEQUENCE;

	// Listen.
	document.addEventListener('keydown', function (event)
	{
		timer && clearTimeout(timer);

		// When the key does not match the next key required
		// in the sequence, just reset sequence progress and
		// stop.
		if (sequence[progress] !== event.key)
		{
			timer = null; progress = 0;

			return;
		}

		++progress;

		// When we have reached the end of the sequence,
		// reset and trigger an event.
		if (sequence.length === progress)
		{
			timer = null; progress = 0;

			triggerEvent(event.target, 'konamicode',
			{
			});

			return;
		}

		// When configured, create a timer that will reset
		// the sequence progress if the user takes too long
		// to enter the next key in the sequence.
		if (allowedTimeBetweenKeys > 0)
		{
			timer = setTimeout(function ()
			{
				timer = null; progress = 0;

			}, allowedTimeBetweenKeys);
		}

	}, true);
}

// --------------------------------------------------------

module.exports = { addSupportForTheKonamiCode };
