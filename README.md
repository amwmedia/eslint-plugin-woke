# eslint-plugin-woke

ESLint plugin to promote diversity and inclusion in codebases.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-woke`:

```
$ npm install eslint-plugin-woke --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-woke` globally.

## Usage

Add `woke` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "woke"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "woke/all": 2
    }
}
```

## Supported Rules

* all
* racism
* profanity
* gender
* LGBTQ

## Contributions Welcome
While this plugin attemts to call attention to as many offensive terms as possible, the work of inclusivity is never complete. Please help to expand the categories and offensive words list so that we can all benefit from our collective lived experiences.
