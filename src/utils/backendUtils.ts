export const backendSchema = {
  baseUrl: 'http://111232.161235.191231.21232:1312338/',
  pingEndpoint: 'ping',
  booksEndpoint: 'books',
  news: 'news/1',

  getPingRouteURL() {
    console.log(this.baseUrl + this.pingEndpoint)
    return this.baseUrl + this.pingEndpoint
  },
  getUpdateNewsRouteURL() {
    console.log(this.baseUrl + this.news)
    return this.baseUrl + this.news
  },

  getHTMLTag() {
    const htmlTag = `<div><h1>Hello, World!</h1><p>This is an example HTML tag.</p></div>`
    return htmlTag
  },

  getBooksRouteURL() {
    console.log(this.baseUrl + this.booksEndpoint)
    return this.baseUrl + this.booksEndpoint
  },
  getBookEditRouteURL(bookId: string) {
    console.log(`${this.baseUrl}${this.booksEndpoint}/${bookId}`)
    return `${this.baseUrl}${this.booksEndpoint}/${bookId}`
  }
}
