# Shopify Lookup Plugin for Sanity

This is a plugin that gives you the ability to search for Shopify products
and save them as part of a document in Sanity.

## Early Development

This plugin was developed as part of an article that I was writing. If you
decide to use this in production then please be warned that this plugin
is in its very early stages of development. There may be bugs. If you do
find a bug, then please feel free to raise an issue and I'll take a look
when I can.

## Top Tip

If you want to fork this project and play around with the code then please note that I developed this plugin with the help of a tool called [Sanipack](https://github.com/rexxars/sanipack). Before this toolkit was developed, I thought developing plugins for Sanity was a bit of a dark art. However, this toolkit takes away a lot of the setup that is required in creating a plugin and also contains some useful verification tools that you can run before publishing to a package manager. Whether you are looking to tweak this plugin or work on your own plugin, you should definitely use sanipack.

## Get Started

To get started install the package within your studio project.

```
yarn add sanity-plugin-shopify-lookup
```

Or for NPM

```
npm i sanity-plugin-shopify-lookup
```

Add the following environment variables to your Sanity project. For help
with environment variables in Sanity, [please visit their documentation]().

**Please Note:** this plugin requires API credentials for the Shopify Storefront
GraphQL API. Instructions for retrieving these details can be found in
the [Shopify documentation](https://shopify.dev/docs/storefront-api/getting-started).

When setting the Storefront API Permissions, please ensure the following options
are selected:

- Read products, variants, and collections
  - Read product tags
  - Read inventory of products and their variants

```
SANITY_STUDIO_SHOPIFY_TOKEN="<value>"
SANITY_STUDIO_SHOPIFY_API_URL="<value>"
```

Then add `"shopify-lookup"` to your plugins array in `sanity.json`.

Update your schema configuratio to use a the lookup field (more details below)
and you should be good to go.

### A Short V.T.

I've recorded a very quick demonstration to show you how this should work.
If you spot any issues or have feedback regarding this documentation, then please
inform me via a Github issue 🙏.

<a href="https://www.loom.com/share/85929d948c694e60921f40146b538e54">
  <p>Sanity Shopify Lookup - What To Expect</p>
  <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/85929d948c694e60921f40146b538e54-with-play.gif">
</a>

## How does it work?

The plugin uses the Shopify Admin API to search for products within your
Shopify inventory. Users of the studio can find products via a text
search. This component will return products with a title that contains
your search term.

The plugin will provide you with a field type called `productLookup`.
You can include this within your document configuration like this:

```js
// ... Document schema
{
  title: "Products",
  name: "products",
  type: "array",
  of: [{ type: "productLookup" }],
},
```

The product lookup contains the following fields:

```js
;[
  {
    name: 'title',
    type: 'string',
    validation: (Rule) => Rule.required().error('You must select a product'),
  },
  {
    name: 'images',
    type: 'array',
    of: [{type: 'url'}],
  },
  {
    name: 'productId',
    type: 'string',
  },
  {
    name: 'productHandle',
    type: 'string',
  },
]
```

The `title` and `images` fields are primarily used for the purpose of displaying
this information within Sanity. The `productId` and `productHandle` strings can
be pulled through to the front end of your website. This means that you can
use these values as part of a API request to Shopify from your website.

### Why doesn't this plugin store all the Shopify product data in Sanity?

The reason for this approach is because product data can change constantly. If
this plugin stored additional data, such as the price and description, then
there is a strong chance that the data in Shopify could change and therefore Sanity will be out of date. At the
moment, I have not come up with an efficient way to keep both Sanity and
Shopify in sync with one another. As my good friend [Sam Beckham](https://twitter.com/samdbeckham)
would say, I am starting out with the boring solution!

## Example Useage

The following example shows how you can retrieve this data from Sanity and pass
it through to a Shopify API request. The example is taken from a website
developed with NextJS. The code below is a post template that retrieves products
which have been added to a Post document in Sanity.

```jsx
/**
 * Singular Post
 */
import ErrorPage from 'next/error'
import {groq} from 'next-sanity'
import {useRouter} from 'next/router'
import {getClient} from '../../lib/sanity'
import {request} from '../../lib/shopify'

const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    products,
    "slug": slug.current
  }
`

function PostTemplate({post, products}) {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <article>
      <h1>{post.title}</h1>
      {products?.length > 0 && (
        <ul>
          {products.map((product) => {
            // For demo purposes this returns title, but you could return
            // much more e.g. images, price etc
            return <li key={product.id}>{product.title}</li>
          })}
        </ul>
      )}
    </article>
  )
}

export async function getStaticProps({params}) {
  const post = await getClient().fetch(postQuery, {slug: params.slug})
  let _products = []

  if (post.products?.length > 0) {
    for (const product of post.products) {
      const variables = {handle: product.productHandle}

      const query = `
        query getProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
          }
        }
      `

      const res = await request(query, variables)

      if (res.errors) {
        console.log(JSON.stringify(res.errors, null, 2))
      } else {
        const product = res.productByHandle
        _products = [..._products, product]
      }
    }
  }

  return {
    props: {
      post,
      products: _products,
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true,
  }
}

export default PostTemplate
```
