'use strict';

// --------------------------------------------------------

module.exports = function performKeyPress (key, element = document)
{
	element.dispatchEvent(
		new KeyboardEvent('keydown', { key })
	);
};
