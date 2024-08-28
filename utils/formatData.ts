import {convert} from 'html-to-text'
export function formatString(str: string): string {
    return str.slice(0,1).toUpperCase() + str.toLowerCase().slice(1)
}

export function convertHTMLToText(HTMLStr:string): string {
    return convert(HTMLStr, {
        wordwrap: false
    })
}
