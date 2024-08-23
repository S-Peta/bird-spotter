export default function formatString(str: string): string {
    return str.slice(0,1).toUpperCase() + str.toLowerCase().slice(1)
}