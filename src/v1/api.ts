import * as cheerio from "cheerio"
import axios from "axios"

export type NitterBurningbirdContent = {
    content: string,
    secondsAgo: number,
}
export type NitterBurningbirdResult = {
    list: NitterBurningbirdContent[],
    countLast30Mins: number,
    countLast20Mins: number,
    countLast10Mins: number,
    countLast5Mins: number,
}

const cacheTimeThresholdSeconds = 30

const getNowSeconds:()=>number = ()=>{
    return Math.floor((+Date.now())/1000)
}

const parseAgoToSeconds:(ago:string)=>number = (ago)=>{
    let num = parseInt(ago.match(/^\d+/)?.[0] || "-1")
    if (ago.endsWith('s')) return num
    if (ago.endsWith('m')) return num*60
    if (ago.endsWith('h')) return num*3600
    if (ago.endsWith('d')) return num*86400
    return -1
}

export default class NitterBurningbirdAPI {
    cacheResult?:NitterBurningbirdResult
    interval?:NodeJS.Timer

    constructor() {
        this.interval = setInterval(this.update.bind(this),cacheTimeThresholdSeconds*1000)
    }

    public dispose() {
	if (this.interval) clearInterval(this.interval)
	this.interval = undefined
    }
    public async getBurningbirdResult():Promise<NitterBurningbirdResult> {
        if (!this.cacheResult) return await this.update()
	return this.cacheResult
    }
    private async update():Promise<NitterBurningbirdResult> {
        // q=트위터터짐
        let body = await axios.get("https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=")
        let parsed = cheerio.load(body.data)
        let timeline = parsed(".timeline-item")
        let result:NitterBurningbirdResult = {
            list: [],
            countLast30Mins: 0,
            countLast20Mins: 0,
            countLast10Mins: 0,
            countLast5Mins: 0,
        }
        timeline.each((_n,element)=>{
            let agoSeconds = parseAgoToSeconds(parsed(element).find(".tweet-date>a").text())
            let item:NitterBurningbirdContent = {
                content: parsed(element).find(".tweet-content").text(),
                secondsAgo: agoSeconds,
            }
            if (agoSeconds < 30*60) result.countLast30Mins++
            if (agoSeconds < 20*60) result.countLast20Mins++
            if (agoSeconds < 10*60) result.countLast10Mins++
            if (agoSeconds < 5*60) result.countLast5Mins++
            result.list.push(item)
        })
        this.cacheResult = result
	return result
    }
}
