'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function performKeyPress (key, element = document)
{
	element.dispatchEvent(
		new KeyboardEvent('keydown', {
			key
		})
	);

	element.dispatchEvent(
		new KeyboardEvent('keyup', {
			key
		})
	);
};
