
import  axios from "axios";
const api = axios.create({
  baseURL: 'https://en.wikipedia.org/w/api.php',
  params: {
    format: 'json',
    origin: '*',
    action: 'query',
  }
})
interface PageInfo {
    title: string;
    pageId: number;
  }
interface Summary {
    summary: string
}
// https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Black and yellow broadbill&format=json
// // .query --> .search[0].title & .pageid

// https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=BLACK%20francolin&format=json&origin=*
// // .query.pages.[pageid].extract

export function getPageTitleAndId(birdName: string): Promise<PageInfo> {
    return api.get('', {
        params: {
            srsearch: birdName,
            list: 'search'
        }
    })
    .then(({data}) => {
        const searchResult = data.query.search[0];
        if (!searchResult) {
          throw new Error('No search results found');
        }
        return {
          title: searchResult.title,
          pageId: searchResult.pageid
        };
      })
    .catch((err) => {
        console.log("Could not get data: ", err)
        throw new Error('Failed to fetch page info');
    })
}

export function getBirdSummary(title:string, pageId:number): Promise<Summary> {
    return api.get('', {
        params: {
            prop: 'extracts',
            exintro: true,
            titles: title
        }
    })
    .then(({data}) => {
        const searchResult = data.query.pages
        if (searchResult.hasOwnProperty('-1')){
            throw new Error('No search results found');
        }
        console.log(data)
        return {
            summary: searchResult[pageId].extract
        }
    })
    .catch((err) => {
        console.log("Could not get data: ", err)
        throw new Error('Failed to fetch page info');
    })
}
