/**
 * @fileoverview ESLint plugin to make your code more woke.
 * @author Andrew Worcester
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');
const {splitWords} = require('./utils');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
console.log('LOADED WOKE!');
const categories = requireIndex(__dirname + "/categories");
const categoryList = Object.keys(categories);
const categoryWordMap = categoryList.reduce((map, key) => Object.assign(map, {
  [key]: categories[key].reduce((obj, group) => {
    group.words.forEach(word => {
      const descr = group.description.replace('{word}', word);
      obj[word] = (obj[word] == null) ? '' : `${obj[word]}\n\r`;
      obj[word] += descr;
    })
    return obj;
  }, {})
}), {});

module.exports.rules = categoryList.reduce((obj, key) => Object.assign(obj, {[key]: {
  meta: {
    type: 'suggestion',
    docs: {
      description: key,
      category: key,
      recommended: true
    },
    fixable: null,
    schema: []
  },

  create: function(context) {
    const wordMap = categoryWordMap[key];
    return ruleHandler(context, wordMap);
  }
}}), {
  all: {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'all',
        category: 'all',
        recommended: true
      },
      fixable: null,
      schema: []
    },

    create: function (context) {
      const wordMap = categoryList
        .reduce((acc, key) => Object.assign(acc, categoryWordMap[key]), {});
      return ruleHandler(context, wordMap);
    }
  }
});

function ruleHandler(context, wordMap) {
  const sourceCode = context.getSourceCode()

  return {
    'VariableDeclarator > Identifier': function (node) {
      const wordMatch = splitWords(node.name).find(word => wordMap.hasOwnProperty(word));
      if (wordMatch == null) return;
      context.report({node, message: wordMap[wordMatch]});
    },
    Program() {
      for (const node of sourceCode.getAllComments()) {
        const wordMatch = splitWords(node.value).find(word => wordMap.hasOwnProperty(word));
        if (wordMatch == null) return;
        context.report({ node, message: wordMap[wordMatch] });
      }
    }
  };
}