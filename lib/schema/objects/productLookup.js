"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _shopifyInput = require("../../components/shopify-input");

var productLookup = {
  name: "productLookup",
  title: "Find Product",
  description: "Find and select the product you wish to display.",
  type: "object",
  inputComponent: _shopifyInput.ShopifyInput,
  fields: [{
    name: "title",
    type: "string",
    validation: function validation(Rule) {
      return Rule.required().error("You must select a product");
    }
  }, {
    name: "images",
    type: "array",
    of: [{
      type: "url"
    }]
  }, {
    name: "productId",
    type: "string"
  }, {
    name: "productHandle",
    type: "string"
  }]
};
var _default = productLookup;
exports["default"] = _default;