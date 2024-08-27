
import  axios from "axios";
import { query } from "firebase/firestore";
const api = axios.create({
  baseURL: 'https://en.wikipedia.org/w/api.php',
  params: {
    format: 'json',
    origin: '*',
    action: 'query',
  }
})
const soundApi = axios.create({
    baseURL: 'https://xeno-canto.org/api/2/recordings'
})
interface PageInfo {
    title: string;
    pageId: number;
  }
interface Summary {
    summary: string
}
interface Sound {
    recording: string
}

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
            exsentences: 7,
            exintro: true,
            titles: title
        }
    })
    .then(({data}) => {
        const searchResult = data.query.pages
        if (searchResult.hasOwnProperty('-1')){
            throw new Error('No search results found');
        }
        return {
            summary: searchResult[pageId].extract
        }
    })
    .catch((err) => {
        console.log("Could not get data: ", err)
        throw new Error('Failed to fetch page info');
    })
}

export function getBirdSounds(birdName:string): Promise<Sound>{
    return soundApi.get('', {
        params: {
            query: birdName,
            page: 1
        }
    })
    .then(({data}) => {
        console.log(data.recordings[0].file)
        return {recording: data.recordings[0].file}
    })
    .catch((err) => {
        console.log("Could not get data: ", err)
        throw new Error('Failed to fetch page info');
    })
}