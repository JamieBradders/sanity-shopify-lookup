/**
 * Returns products that match the query criteria.
 * Query term must conform to shopify search syntax
 * https://shopify.dev/concepts/about-apis/search-syntax
 */
export const productByTerm = `
  query getProductByTerm($term: String!) {
    products(first: 50, query: $term) {
      edges {
        node {
          id
          title
          handle
          images(first: 5) {
            edges {
              node {
                transformedSrc
              }
            }
          }
        }
      }
    }
  }
`;
