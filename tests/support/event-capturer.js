import {
	mock
} from 'node:test';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class EventCapturer
{
	#event   = null;
	#window  = null;
	#handler = mock.fn();

	constructor (event, window)
	{
		this.#event  = event;
		this.#window = window;
	}

	start ()
	{
		this.#window.document.addEventListener(this.#event, this.#handler, false);

		return this;
	}

	stop ()
	{
		this.#window.document.removeEventListener(this.#event, this.#handler, false);

		return this;
	}

	reset ()
	{
		this.#handler.mock.resetCalls();

		return this;
	}

	getCapturedEvents ()
	{
		return this.#handler.mock.calls.map(call => call.arguments[0]);
	}

	getCapturedEventCount ()
	{
		return this.#handler.mock.callCount();
	}
}
