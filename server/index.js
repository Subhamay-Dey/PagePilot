import * as cheerio from 'cheerio';
import axios from "axios"

class Scrape {
    static async scareWebpage(url="") {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);

        const pageHead = $('head').html();
        const pageBody = $('body').html();

        const internalLinks = [];
        const externalLink = [];

        console.log({pageHead});

        $('a').each((_, el) => {
            const link = $(el).attr('href');
            console.log(link);
            if(link.startsWith("http") || link.startsWith("https")) {
                externalLink.push(link);
                console.log(externalLink);
            } else {
                internalLinks.push(link);
                console.log(internalLinks);
            }
            if(link == "/") return;
        })
    }
}

Scrape.scareWebpage("https://piyushgarg.dev")