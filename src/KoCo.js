'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function addSupportForTheKonamiCode ({
	requireEnterPress = false, allowedTimeBetweenKeys = 0
} = {})
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

	document.addEventListener('keydown', konamiCodeSequenceListener, true);

	return function removeSupportForTheKonamiCode ()
	{
		document.removeEventListener('keydown', konamiCodeSequenceListener, true);
	};
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = { addSupportForTheKonamiCode };
