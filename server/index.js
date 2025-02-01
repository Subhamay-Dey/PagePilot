import * as cheerio from 'cheerio';
import axios from "axios"

class Scrape {
    static async scareWebpage(url="") {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);

        const pageHead = $('head').html();
        const pageBody = $('body').html();

        console.log({pageHead});

        $('a').each((_, el) => {
            const link = $(el).attr('href');
            console.log(link);
        })
    }
}

Scrape.scareWebpage("http://awwwards.com")