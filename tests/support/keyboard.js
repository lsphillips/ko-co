export default class Keyboard
{
	#window = null;

	constructor (window)
	{
		this.#window = window;
	}

	performKeyPresses (keys, target = this.#window.document)
	{
		for (const key of keys)
		{
			target.dispatchEvent(new this.#window.KeyboardEvent('keydown', {
				key
			}));

			target.dispatchEvent(new this.#window.KeyboardEvent('keyup', {
				key
			}));
		}
	}
}
