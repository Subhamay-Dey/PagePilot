import * as cheerio from 'cheerio';
import axios from "axios"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config()

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

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

            async function run({text}) {
                const result = await model.embedContent(text);
                console.log(result.embedding.values);
            }
            run({text: link});

        })    
    };
    static async ingest(url="") {
    const {pageHead, pageBody, internalLinks} = await Scrape.scareWebpage(url);

    const headEmbedding = await Scrape.run({text:pageHead})

    const bodyChunks = chunktext(pageBody, 2000)
    
    for(const chunk of bodyChunks) {
        const bodyEmbedding = await Scrape.scareWebpage.run({text:pageBody})
    }

    const bodyEmbedding = await Scrape.run({text:pageHead})

    function chunktext(text, numChunks) {
        if (numChunks <= 0) {
            throw new Error("Number of chunks must be greater than zero");
        }
        
        const chunkSize = Math.ceil(text.length / numChunks);
        const chunks = [];
        
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }
        
        return chunks;
    
    }


}
    
}

Scrape.scareWebpage("https://piyushgarg.dev")