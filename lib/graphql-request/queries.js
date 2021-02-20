"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productByTerm = void 0;

/**
 * Returns products that match the query criteria.
 * Query term must conform to shopify search syntax
 * https://shopify.dev/concepts/about-apis/search-syntax
 */
var productByTerm = "\n  query getProductByTerm($term: String!) {\n    products(first: 50, query: $term) {\n      edges {\n        node {\n          id\n          title\n          handle\n          images(first: 5) {\n            edges {\n              node {\n                transformedSrc\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n";
exports.productByTerm = productByTerm;