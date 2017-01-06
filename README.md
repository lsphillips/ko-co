# KoCo

Adds support for the Konami Code; making your website automatically cool.

## What is the Konami Code?

The Konami Code is a cheat code that appears in many video games created by Konami. The code was first used in the 1986 release of Gradius on the Nintendo Entertainment System (NES). It was further popularized in the North American release of Contra on the NES.

The Konami Code requires players to enter the following sequence using their game pad: **↑ ↑ ↓ ↓ ← → ← → B A**

## Usage

KoCo takes a different approach to already existing Konami Code libraries. It utilizes DOM events, bringing some nice advantages:

- It keeps the library lightweight.
- It keeps the view code agnostic of KoCo. You just register DOM event listeners.
- It allows control over what elements the user can use to trigger a Konami Code easter egg. You just register the listener to specific elements.
- It is easy to stop listening when your application needs to get serious for a moment.

### Initializing

To add Konami Code support you just need to call the `addSupportForTheKonamiCode()` method, most likely in your application entry point. For example:

``` js
require('ko-co').addSupportForTheKonamiCode(
{
    requireEnterPress : true
});
```

#### Options

You can pass some options to control how the Konami Code sequence is detected:

- `requireEnterPress` - Determines whether the user needs to press enter before the Konami Code is triggered. Defaults to `false`.
- `allowedTimeBetweenKeys` - Determines the maximum allowed time (in milliseconds) between key presses before sequence progress is reset. By default the user can take as long as they want.

### Listening

Listening for the Konami Code is as simple as listening for native DOM events:

``` js
anEventTarget.addEventListener('konamicode', function ()
{
    console.log('The Konami Code has been entered. 30 more lives for you!');
});
```

The `konamicode` event bubbles, so event delegation works as expected.

## Getting started

This project is available through the Node Package Manager (NPM), so you can install it like so:

```
npm install ko-co
```

**Please Note:** Versions of Node lower than v6.0.0 are not supported, this is because it is written using ECMAScript 6 features.

## Development

This project doesn't have much of a build process. It does have tests though; which you can run through NPM like so:

``` sh
npm test
```

This also runs code quality checks using ESLint. Please refer to the `.eslintrc` file to familiar yourself with the rules.

## License

This project is released under the MIT license.
