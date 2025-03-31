import {
	mock
} from 'node:test';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export class EventCapturer
{
	#event    = null;
	#document = null;
	#handler  = mock.fn();

	constructor (event, window)
	{
		this.#event    = event;
		this.#document = window.document;
	}

	start ()
	{
		this.#document.addEventListener(this.#event, this.#handler, false);

		return this;
	}

	stop ()
	{
		this.#document.removeEventListener(this.#event, this.#handler, false);

		return this;
	}

	reset ()
	{
		this.#handler.mock.resetCalls();

		return this;
	}

	hasCapturedEvent ({
		type       = CustomEvent,
		bubbles    = true,
		cancelable = true,
		target     = this.#document
	})
	{
		return this.#handler.mock.calls.some(call =>
		{
			const e = call.arguments[0];

			return e instanceof type && e.type === this.#event && e.bubbles === bubbles && e.cancelable === cancelable && e.target === target;
		});
	}

	hasNotCapturedAnyEvent ()
	{
		return this.#handler.mock.callCount() === 0;
	}
}
