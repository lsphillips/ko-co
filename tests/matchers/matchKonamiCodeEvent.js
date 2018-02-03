'use strict';

// Dependencies
// --------------------------------------------------------

const { match } = require('sinon');

// --------------------------------------------------------

module.exports = function matchKonamiCodeEvent ({ dispatchBy = document } = {})
{
	return match(event =>
	{
		let {
			type,
			bubbles,
			cancelable,
			target
		} = event;

		return event instanceof CustomEvent && type === 'konamicode' && bubbles && cancelable && target === dispatchBy;

	}, 'A Konami Code Event');
};
