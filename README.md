# TextHighlighter

TextHighlighter allows you to highlight text on web pages. Just select it!

## Getting started

### Using the library as an npm package

Install the library by running:

```bash
$ npm install text-highlighter
```

Then you can use it like so:

```javascript
import TextHighlighter from 'text-highlighter';

// Example using a React ref if you are building a react application.
const highlighter = new TextHighlighter(sandboxRef.current);

// Example using an element accessed directly from the DOM.
const highlighter = new TextHighlighter(document.getElementById("sandbox"));
```

### Using the library as a script file

Clone down this repository, checkout to the release tag representing the version you would like to use. 
(2.x.x + only, this won't work for 1.x.x, please refer to the documentation provided with 1.x.x releases)

Ensure grunt is installed globally:
```bash
npm install -g grunt
```

Build the minified version of the library using the following command:
```bash
grunt build
```

Copy the script file from `build/prod/TextHighlighter.min.js` to the head section of your web page:

```html
<script type="text/javascript" src="TextHighlighter.min.js"></script>
```

And use it!

```javascript
var hltr = new TextHighlighter(document.body);
```

## Features

* Highlighting of selected text.
* Highlighting all occurrences of given text (find & highlight).
* Removing highlights.
* Selecting highlight color.
* Serialization & deserialization.
* Focusing & deselecting overlapping highlights.
* Works well in iframes.
* Keeps DOM clean.
* No dependencies. No jQuery or other libraries needed.

## Compatibility

Should work in all decent browsers and IE 11.

## Running the tests

First run `npm install` from the root directory of the repo to install all the test runner dependencies.

### Integration tests

The integration tests covers the integration of the larger components that make up the highlighting
functionality such as serialisation + deserialisation, focusing, deselecting, normalisation and interaction with callbacks.

To run the integration tests use the following command:
```bash
npm run test:integration
```

### Unit tests

The unit tests cover functions that make up the smaller components that query, manipulate the DOM
along with pure utility pieces.

To run the unit tests use the following command:
```bash
npm run test:unit
```

### Running the Primitivo tests (The first version of the highlighter)

The first version of the highlighter contains tests in a standalone jasmine runner that runs in the browser.

To run those tests, first set up the server:
```bash
node testserver.js
```

Then go to `http://localhost:5002/test/test.html` and the tests will run on page load.

## Building the API reference documentation

Ensure all dev dependencies are installed using:
```bash
npm install
```

Ensure grunt is installed globally:
```bash
npm install -g grunt
```

To build the documentation, run the following command:
```bash
grunt jsdoc
```

Ensure the test server is running:
```bash
node testserver.js
```

Then go to `http://localhost:5002/doc` to see the API reference for the library.

## Demos

* [Simple demo](http://perlego.github.io/texthighlighter/demos/simple.html)
* [Callbacks](http://perlego.github.io/texthighlighter/demos/callbacks.html)
* [Serialization](http://perlego.github.io/texthighlighter/demos/serialization.html)
* [Serialization (Absolutely positioned elements)](http://perlego.github.io/texthighlighter/demos/serialization-absolute-positioning.html)
* [Iframe](http://perlego.github.io/texthighlighter/demos/iframe.html)

## Documentation
   
You may check [API reference](http://perlego.github.io/texthighlighter/doc/index.html) or 
[Wiki](https://github.com/Perlego/texthighlighter/wiki) pages on GitHub.
