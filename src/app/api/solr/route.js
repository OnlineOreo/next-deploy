// app/api/solr/route.js
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing query parameter: q' }), {
      status: 400,
    });
  }

  const solrBase = process.env.NEXT_PUBLIC_SOLR_BASE_URL;
  const solrUrl = `${solrBase}/solr/Print-collection/select?indent=true&q.op=OR&q=${q}&rows=15&start=0`;
  const sideFilterUrl = `${solrBase}/solr/Print-collection/select?indent=true&q=*:*&fq=${q}&facet=true&facet.field=dc_publishers_string&facet.field=datacite_rights_string&facet.field=resource_types_string&facet.field=dc_date&facet.field=datacite_creators_string&facet.limit=500&facet.sort=count`;

  try {
    // Fetching Solr and side filter data concurrently
    const [response, sideFilterResponse] = await Promise.all([
      axios.get(solrUrl),
      axios.get(sideFilterUrl),
    ]);

    const docs = response.data.response.docs || [];
    const numFound = response.data.response.numFound || 0;
    const facetCounts = sideFilterResponse.data.facet_counts?.facet_fields || {};

    // Cleaned-up response data
    const data = {
      docs,
      numFound,
      facetCounts, // You can structure this as needed in the frontend
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Improved error message with specific error details
    return new Response(
      JSON.stringify({
        error: 'Solr fetch failed',
        details: error.response ? error.response.data : error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
