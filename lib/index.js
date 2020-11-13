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
const categories = requireIndex(__dirname + "/categories");
const categoryList = Object.keys(categories);
const categoryWordMap = categoryList.reduce((map, key) => Object.assign(map, {
  [key]: categories[key].reduce((obj, group) => {
    group.words.forEach(word => {
      const rootWord = Array.isArray(word) ? word[0] : word;
      const words = Array.isArray(word) ? word : [word];
      const descr = group.description.replace('{word}', words.join(' '));
      obj[rootWord] = obj[rootWord] || [];
      obj[rootWord].push({ descr, words });

      // look for terms as a single word as well.
      if (words.length > 1) {
        const oneWord = words.join('');
        const descr = group.description.replace('{word}', oneWord);
        obj[oneWord] = obj[oneWord] || [];
        obj[oneWord].push({ descr, words: [oneWord] });
      }
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
    Identifier: function (node) {
      if (node.parent.type === 'CallExpression') return;
      if (node.parent.type === 'MemberExpression') return;
      const message = splitWords(node.name).reduce((descr, root, idx, arr) => {
        if (!wordMap.hasOwnProperty(root)) return descr;
        const matchesDescr = wordMap[root]
          .filter(m => m.words.join('') === arr.slice(idx, idx + m.words.length).join(''))
          .map(m => m.descr).join('\n\r');
        return [descr, matchesDescr].filter(v => v.length).join('\n\r');
      }, '');
      if (!message) return;
      context.report({node, message});
    },
    Program() {
      for (const node of sourceCode.getAllComments()) {
        const message = splitWords(node.value).reduce((descr, root, idx, arr) => {
          if (!wordMap.hasOwnProperty(root)) return descr;
          const matchesDescr = wordMap[root]
            .filter(m => m.words.join('') === arr.slice(idx, idx + m.words.length).join(''))
            .map(m => m.descr).join('\n\r');
          return [descr, matchesDescr].filter(v => v.length).join('\n\r');
        }, '');
        if (!message) return;
        context.report({ node, message });
      }
    }
  };
}