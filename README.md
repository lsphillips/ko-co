# KoCo

[![Available from NPM](https://img.shields.io/npm/v/ko-co.svg?maxAge=900)](https://www.npmjs.com/package/ko-co)
[![Built using Travis](https://img.shields.io/travis/lsphillips/KoCo/master.svg?maxAge=900)](https://travis-ci.org/lsphillips/KoCo)

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
KoCo.addSupportForTheKonamiCode(
{
    // Options...
});
```

#### Options

You can pass some options to control how the Konami Code sequence is detected:

- `requireEnterPress` - Determines whether the enter key is required to conclude a Konami Code sequence. Defaults to `false`.
- `allowedTimeBetweenKeys` - The maximum amount of time (in milliseconds) to wait between key presses before sequence progress is reset. By default the user can take as long as they want.

### Listening

Listening for the Konami Code is just like listening to regular DOM events:

``` js
target.addEventListener('konamicode', () =>
{
    console.log('The Konami Code has been entered. 30 more lives for you!');
});
```

The `konamicode` event bubbles and is cancelable, so event delegation works as expected.

### Restoring

If you want to remove support for the Konami Code completely, `KoCo.addSupportForTheKonamiCode()` will return a function that will do that for you:

``` js
let makeMyWebsiteBoringAgain = KoCo.addSupportForTheKonamiCode(
{
    // Options...
});

makeMyWebsiteBoringAgain();
```

## Getting started

This project is available through the Node Package Manager (NPM), so you can install it like so:

```
npm install ko-co
```

This is a `commonjs` module; so you will need to use a bundler.

## Development

This project doesn't have much of a build process. It does have tests though; which you can run like so:

``` sh
npm test
```

This also runs code quality checks using ESLint. Please refer to the `.eslintrc` files to familiar yourself with the rules.

## License

This project is released under the MIT license.
