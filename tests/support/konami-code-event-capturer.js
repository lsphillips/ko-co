import { spy, assert } from 'sinon';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const KONAMI_CODE_EVENT_NAME = 'konamicode';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class KonamiCodeEventCapturer
{
	constructor ()
	{
		Object.defineProperty(this, 'handler', {
			value : spy()
		});
	}

	start ()
	{
		document.addEventListener(KONAMI_CODE_EVENT_NAME, this.handler, false);

		return this;
	}

	stop ()
	{
		document.removeEventListener(KONAMI_CODE_EVENT_NAME, this.handler, false);

		return this;
	}

	reset ()
	{
		this.handler.resetHistory();

		return this;
	}

	hasCapturedEvent ({
		dispatchedBy = document
	} = {})
	{
		assert.calledWithMatch(this.handler, event =>
		{
			const { type, bubbles, cancelable, target } = event;

			// 1. The event must be a custom event.
			// 2. The event type must be correct.
			// 3. The event must bubble.
			// 4. The event must be cancelable.
			// 5. The event must have been dispatched by
			//    the specified element.
			return event instanceof CustomEvent
				&& type === KONAMI_CODE_EVENT_NAME
				&& bubbles
				&& cancelable
				&& target === dispatchedBy;
		});
	}

	hasNotCapturedEvent ()
	{
		assert.notCalled(this.handler);
	}
}
