import { OpenAIModel, Source } from "@/types";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import type { NextApiRequest, NextApiResponse } from "next";
import { cleanSourceText } from "../../utils/sources";
import { config } from '../../utils/config';

// console.log("process.env.CONFLUENCE_URL >>>",config.confluenseURL)

type Data = {
  sources: Source[];
};

interface Result {
  content: {
      id: string;
      type: string;
      status: string;
      title: string;
      restrictions: {};
      _links: {
          webui: string;
          tinyui: string;
          self: string;
      };
      _expandable: {
          container: string;
          metadata: string;
          extensions: string;
          operations: string;
          children: string;
          history: string;
          ancestors: string;
          body: string;
          version: string;
          descendants: string;
          space: string;
      };
  };
  title: string;
  excerpt: string;
  url: string;
  resultGlobalContainer: {
      title: string;
      displayUrl: string;
  };
  entityType: string;
  iconCssClass: string;
  lastModified: string;
  friendlyLastModified: string;
  timestamp: number;
}

interface SearchResult {
  results: Result[];
  start: number;
  limit: number;
  size: number;
  totalSize: number;
  cqlQuery: string;
  searchDuration: number;
  _links: {
      base: string;
      context: string;
  };
}

function extractUrlsFromResults(json: SearchResult): string[] {
  const urls: string[] = [];

  json.results.forEach((result) => {
      urls.push(config.confluenseURL+result.url);
  });

  return urls;
}


function parseStringToSearchResult(jsonString: string): SearchResult {
  return JSON.parse(jsonString) as SearchResult;
}

const searchHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { query, model } = req.body as {
      query: string;
      model: OpenAIModel;
    };

    const sourceCount = 4;
    // GET LINKS
    // `${confluenseURL}/rest/quicknav/1/search?query=${query}`
    const fetchUrl = `${config.confluenseURL}/rest/api/search?cql=siteSearch ~ "${encodeURIComponent(query)}" AND type in ("space","user","com.atlassian.confluence.extra.team-calendars:calendar-content-type","attachment","page","com.atlassian.confluence.extra.team-calendars:space-calendars-view-content-type","blogpost")&start=0&limit=4&excerpt=highlight&expand=space.icon&includeArchivedSpaces=false`;
    const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${config.confluenseToken}`
        }
    };

    console.log("Confluence fetch url and options >>>", fetchUrl, fetchOptions)
    const response = await fetch(fetchUrl, fetchOptions);
    const html = await response.text();

    // console.log("RAW search results >>> ", html)

    const jsonBody: SearchResult = parseStringToSearchResult(html);

    let finalLinks: string[] = [];
  
    if(jsonBody!==null){
      finalLinks = extractUrlsFromResults(jsonBody)
    }

    // console.log("finalLinks>>>", finalLinks)

    // SCRAPE TEXT FROM LINKS
    const sources = (await Promise.all(
      finalLinks.map(async (link) => {
        const fetchOptions: RequestInit = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.confluenseToken}`
            }
        };
        const response = await fetch(link, fetchOptions);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const parsed = new Readability(doc).parse();

        if (parsed) {
          let sourceText = cleanSourceText(parsed.textContent);

          return { url: link, text: sourceText };
        }
      })
    )) as Source[];

    const filteredSources = sources.filter((source) => source !== undefined);

    for (const source of filteredSources) {
      source.text = source.text.slice(0, 1500);
    }

    res.status(200).json({ sources: filteredSources });
  } catch (err) {
    console.log(err);
    res.status(500).json({ sources: [] });
  }
};

export default searchHandler;