import { Suspense } from 'react';
import PrintCollectionContent from './PrintCollectionContent';
import SideFilter from "@/app/Components/SideFilter";
import Results from "@/app/Components/Results";
import axios from "axios";

function combineFacetData(facetData) {
  const combined = [];
  for (let i = 0; i < facetData.length; i += 2) {
    const name = facetData[i];
    const count = facetData[i + 1] || 0;
    combined.push({ name, count: parseInt(count, 10) });
  }
  return combined;
}

async function fetchSolrData(searchQuery, startIndex = 0) {
  if (!searchQuery) return { results: [], resultsCount: 0, sideFilterResults: {} };

  try {
    const solrBase = process.env.NEXT_PUBLIC_SOLR_BASE_URL;

    const solrUrl = `${solrBase}/solr/Print-collection/select?indent=true&q.op=OR&q=${searchQuery}&rows=15&start=${startIndex}`;
    const sideFilterUrl = `${solrBase}/solr/Print-collection/select?indent=true&q=*:*&fq=${searchQuery}&facet=true&facet.field=dc_publishers_string&facet.field=datacite_rights_string&facet.field=resource_types_string&facet.field=dc_date&facet.field=datacite_creators_string&facet.limit=500&facet.sort=count`;

    const [response, sideFilterResponse] = await Promise.all([
      axios.get(solrUrl),
      axios.get(sideFilterUrl)
    ]);

    const docs = response.data.response.docs || [];
    const numFound = response.data.response.numFound || 0;

    const sideData = sideFilterResponse.data;
    const facets = ["dc_publishers_string", "datacite_rights_string", "resource_types_string", "datacite_creators_string", "dc_date"];

    const sideFilterResults = {};
    facets.forEach(facet => {
      sideFilterResults[facet] = combineFacetData(sideData.facet_counts?.facet_fields?.[facet] || []);
    });

    return {
      results: docs,
      resultsCount: numFound,
      sideFilterResults
    };
  } catch (error) {
    console.error("Solr fetch failed:", error);
    return { results: [], resultsCount: 0, sideFilterResults: {} };
  }
}

export default async function PrintCollectionPage({ searchParams }) {
  const searchQuery = searchParams?.q || "";
  const data = await fetchSolrData(searchQuery, 0);

  return (
    <PrintCollectionContent
      sidebar={
        <Suspense fallback={<div>Loading filters...</div>}>
          <SideFilter {...data.sideFilterResults} />
        </Suspense>
      }
      content={
        <Suspense fallback={<div>Loading results...</div>}>
          <Results results={data.results} resultsCount={data.resultsCount} />
        </Suspense>
      }
    />
  );
}
