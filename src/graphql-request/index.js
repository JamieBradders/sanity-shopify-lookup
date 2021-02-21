// Helper function for performing
// graphql queries to shopify!
const URL = process.env.SANITY_STUDIO_SHOPIFY_API_URL
const SHOPIFY_TOKEN = process.env.SANITY_STUDIO_SHOPIFY_TOKEN

export const request = async (query, variables = {}) => {
  if (!query) {
    throw Error('Invalid request. No query provided')
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({query, variables}),
  }

  try {
    const res = await fetch(URL, options)

    if (res.ok) {
      return await res.json()
    }

    return {
      status: res.status,
      message: res.statusText,
    }
  } catch (err) {
    console.error('There was a problem performing this query:', err)
    return {
      error: {
        message: `Unable to perform query. Please check console.`,
      },
    }
  }
}
