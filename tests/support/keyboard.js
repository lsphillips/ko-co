export function performKeyPresses (window, keys, target = window.document)
{
	for (const key of keys)
	{
		target.dispatchEvent(new window.KeyboardEvent('keydown', {
			key
		}));

		target.dispatchEvent(new window.KeyboardEvent('keyup', {
			key
		}));
	}
}
