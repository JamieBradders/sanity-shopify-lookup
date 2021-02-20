import * as React from "react";
import FormField from "part:@sanity/components/formfields/default";
import {
  Stack,
  Card,
  Spinner,
  Flex,
  Button,
  TextInput,
  Box,
  ThemeProvider,
  studioTheme,
  Text,
  Heading,
  Radio,
} from "@sanity/ui";
import { patches, PatchEvent } from "part:@sanity/form-builder";
import { request } from "../../graphql-request";
import { productByTerm } from "../../graphql-request/queries";

// Lookup component, this will be moved
const Lookup = ({ searchCallback }) => {
  const [term, setTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setTerm(value);
  };

  const handleButtonClick = async (event) => {
    event.preventDefault();

    // If the search term is less than 3 characters, then ensure the
    // query can't be performed. This code prevents submission by
    // return key on keyboard
    if (term.length < 3) {
      return false;
    }

    setLoading(true);

    try {
      const query = productByTerm;
      const variables = { term: `title:${term}*` };
      const res = await request(query, variables);

      if (!res.data.products) {
        console.error("Unable to get products from shopify", data);
      } else {
        searchCallback(res.data.products);
      }

      setLoading(false);
    } catch (err) {
      console.error("Problem getting products:", err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleButtonClick}>
      <Flex>
        <Box flex={1} marginRight={2}>
          <TextInput
            value={term}
            width="100%"
            flex={1}
            onChange={handleInputChange}
          />
        </Box>

        {loading ? (
          <Flex align="center" justify="center" style={{ width: 60 }}>
            <Spinner muted />
          </Flex>
        ) : (
          <Button
            text="Search"
            tone="primary"
            type="submit"
            disabled={term.length < 3}
          />
        )}
      </Flex>
    </form>
  );
};

export const ShopifyInput = ({ type, onChange, value }) => {
  const [results, setResults] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState();

  const callback = (products) => setResults(products.edges);

  const handleSelection = (value, item) => {
    const { set } = patches;

    // Update local state so user knows what is selectd
    setSelectedItem(value);

    // Update sanity data
    onChange(PatchEvent.from(set(item.node.id, ["productId"])));
    onChange(PatchEvent.from(set(item.node.handle, ["productHandle"])));
    onChange(PatchEvent.from(set(item.node.title, ["title"])));
    onChange(PatchEvent.from(set(item.node.images.edges, ["images"])));
  };

  return (
    <ThemeProvider theme={studioTheme}>
      {value && value.title && (
        <Box marginBottom={4}>
          <Box marginBottom={4}>
            <Heading as="h3" size={1} style={{ marginBottom: 12 }}>
              Selected Product
            </Heading>

            <Text>
              This is the product that you have selected from Shopify.
            </Text>
          </Box>

          <Card radius={2} shadow={1}>
            <Flex width="100%" align="center">
              {value.images && (
                <img
                  src={value.images[0].node.transformedSrc}
                  width="50"
                  height="50"
                  style={{ objectFit: "cover" }}
                />
              )}

              <Box paddingY={3} paddingX={4} flex={1}>
                <Flex justify="space-between" width="100%">
                  <Text size={2}>{value.title}</Text>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Box>
      )}

      <FormField label={type.title} description={type.description}>
        <Lookup searchCallback={callback} />

        {results && results.length > 0 && (
          <>
            <Box marginY={4}>
              <Text size={1}>
                Found {results.length}{" "}
                {results.length === 1 ? "result" : "results"}
              </Text>
            </Box>
            <Stack space={3}>
              {results.map((result) => {
                const { node } = result;
                return (
                  <Card radius={2} shadow={1} key={node.id}>
                    <Flex width="100%" align="center">
                      {node.images && (
                        <img
                          src={node.images.edges[0].node.transformedSrc}
                          width="50"
                          height="50"
                          style={{ objectFit: "cover" }}
                        />
                      )}

                      <Box paddingY={3} paddingX={4} flex={1}>
                        <label htmlFor={`product-${node.id}`}>
                          <Flex justify="space-between" width="100%">
                            <Text size={2}>{node.title}</Text>
                            <Radio
                              id={`product-${node.id}`}
                              value={node.id}
                              checked={selectedItem === node.id}
                              onChange={(e) =>
                                handleSelection(e.target.value, result)
                              }
                            />
                          </Flex>
                        </label>
                      </Box>
                    </Flex>
                  </Card>
                );
              })}
            </Stack>
          </>
        )}
      </FormField>
    </ThemeProvider>
  );
};
