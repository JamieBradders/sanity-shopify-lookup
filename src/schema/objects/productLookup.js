import { ShopifyInput } from "../../components/shopify-input";

const productLookup = {
  name: "productLookup",
  title: "Find Product",
  description: "Find and select the product you wish to display.",
  type: "object",
  inputComponent: ShopifyInput,
  fields: [
    {
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().error("You must select a product"),
    },
    {
      name: "images",
      type: "array",
      of: [{ type: "url" }],
    },
    {
      name: "productId",
      type: "string",
    },
    {
      name: "productHandle",
      type: "string",
    },
  ],
};

export default productLookup;
