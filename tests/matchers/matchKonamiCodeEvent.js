'use strict';

// Dependencies
// --------------------------------------------------------

const { match } = require('sinon');

// --------------------------------------------------------

module.exports = function matchKonamiCodeEvent ({ dispatchBy = document } = {})
{
	return match(event =>
	{
		let { type, bubbles, cancelable, target } = event;

		// 1. The event must be a custom event.
		// 2. The event type must be `konamicode`.
		// 3. The event must bubble.
		// 4. The event must be cancelable.
		// 5. The event must have been dispatched by the specified
		//    element.
		return event instanceof CustomEvent && type === 'konamicode' && bubbles && cancelable && target === dispatchBy;

	}, 'a valid Konami Code event');
};
