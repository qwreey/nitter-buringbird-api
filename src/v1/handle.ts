import {
    type instance
} from "../index"
import { Type } from '@sinclair/typebox'
import NitterBurningbirdAPI from "./api"
import RSS from "rss"

export default function(instance: instance, _options:any, done:VoidFunction) {
    const api = new NitterBurningbirdAPI()
    
    instance.get("/v1/json",{
        schema: {
            response: {
                200: Type.Object({
                    list: Type.Array(Type.Object({
                        content: Type.String(),
                        secondsAgo: Type.Number(),
                    })),
                    countLast30Mins: Type.Number(),
                    countLast20Mins: Type.Number(),
                    countLast10Mins: Type.Number(),
                    countLast5Mins: Type.Number(),
                })
            }
        } as const,
        async handler(request, reply) {
            reply.send(await api.getBurningbirdResult())
        }
    })

    instance.get("/v1/rss",{
        schema: {
            querystring: Type.Object({
                min30: Type.Boolean({default: true}),
                min20: Type.Boolean({default: true}),
                min10: Type.Boolean({default: true}),
                min5:  Type.Boolean({default: true}),
                title: Type.Optional(Type.String({})),
                mini:  Type.Boolean({default: false}),
            })
        },
        async handler(request, reply) {
            let now = new Date()
            const newFeed = new RSS({
                title: "불타는 짹짹이 추적기",
                description: "트위터가 불타고 있는지 추적합니다",
                feed_url: "https://burningbird.qwreey.kr/v1/rss",
                site_url: "https://burningbird.qwreey.kr",
                pubDate: now,
            })
            let apiResult = await api.getBurningbirdResult()

            if (request.query.title) newFeed.item({
                title: request.query.title,
                description: "",
                url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                guid: "1",
                categories: ["none"],
                author: "Qwreey",
                date: now
            })
            if (!request.query.mini) {

                if (request.query.min30) newFeed.item({
                    title: `30 분동안 ${apiResult.countLast30Mins} 트윗`,
                    description: "",
                    url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                    guid: "1",
                    categories: ["none"],
                    author: "Qwreey",
                    date: now
                })
                if (request.query.min20) newFeed.item({
                    title: `20 분동안 ${apiResult.countLast20Mins} 트윗`,
                    description: "",
                    url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                    guid: "1",
                    categories: ["none"],
                    author: "Qwreey",
                    date: now
                })
                if (request.query.min10) newFeed.item({
                    title: `10 분동안 ${apiResult.countLast10Mins} 트윗`,
                    description: "",
                    url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                    guid: "1",
                    categories: ["none"],
                    author: "Qwreey",
                    date: now
                })
                if (request.query.min5) newFeed.item({
                    title: `5 분동안 ${apiResult.countLast5Mins} 트윗`,
                    description: "",
                    url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                    guid: "1",
                    categories: ["none"],
                    author: "Qwreey",
                    date: now
                })
            } else {
                let contents = []
                if (request.query.min30) contents.push("30분: "+apiResult.countLast30Mins)
                if (request.query.min20) contents.push("20분: "+apiResult.countLast20Mins)
                if (request.query.min10) contents.push("10분: "+apiResult.countLast10Mins)
                if (request.query.min5) contents.push("5분: "+apiResult.countLast5Mins)
                newFeed.item({
                    title: contents.join(" · "),
                    description: "",
                    url: "https://nitter.net/search?f=tweets&q=%ED%8A%B8%EC%9C%84%ED%84%B0%ED%84%B0%EC%A7%90&since=&until=&near=",
                    guid: "1",
                    categories: ["none"],
                    author: "Qwreey",
                    date: now
                })
            }

            reply.type("application/xml")
            reply.send(newFeed.xml())
        }
    })

    done()
}
