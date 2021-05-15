/**
 * Options that define how a Konami Code sequence is detected.
 */
export interface KonamiCodeDetectionOptions
{
	/**
	 * Determines whether the enter key is required to conclude a Konami Code sequence.
	 */
	requireEnterPress? : boolean;

	/**
	 * The maximum amount of time (in milliseconds) to wait between key presses before sequence progress is reset.
	 */
	allowedTimeBetweenKeys? : number;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/**
 * A synchronous function that will remove support for the Konami Code.
 */
export interface KonamiCodeSupportRemover
{
	() : void
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/**
 * Adds support for the Konami Code.
 *
 * Example usage:
 *
 * ``` js
 * koco.addSupportForTheKonamiCode(
 * {
 *     allowedTimeBetweenKeys : 500
 * });
 * ```
 *
 * Once support is added, all elements will now fire a `konamicode` event whenever the user enters the Konami Code sequence:
 *
 * ``` js
 * target.addEventListener('konamicode', () =>
 * {
 *     console.log('The Konami Code has been entered. 30 more lives for you!');
 * });
 * ```
 *
 * **Note:** The `konamicode` event bubbles and is cancelable.
 *
 * @param options Options that define how a Konami Code sequence is detected. By default, the enter key is not required to conclude the Konami Code sequence and it will wait indefinitely between key presses.
 *
 * @returns A synchronous function that can be called to remove support for the Konami Code.
 */
export function addSupportForTheKonamiCode(options? : KonamiCodeDetectionOptions) : KonamiCodeSupportRemover;
