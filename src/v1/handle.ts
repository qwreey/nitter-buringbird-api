import {
    type instance
} from "../index"
import { Type } from '@sinclair/typebox'
import NitterBuringbirdAPI from "./api"
import RSS from "rss"

export default function(instance: instance, _options:any, done:VoidFunction) {
    const api = new NitterBuringbirdAPI()
    
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
            reply.send(await api.getBuringbirdResult())
        }
    })

    instance.get("/v1/rss",{
        schema: {
            params: {
                
            }
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
            let apiResult = await api.getBuringbirdResult()

            newFeed.item({
                title: `30 분동안 ${apiResult.countLast30Mins} 트윗`,
                description: "",
                url: "",
                guid: "1",
                categories: ["none"],
                author: "Qwreey",
                date: now
            })
            newFeed.item({
                title: `20 분동안 ${apiResult.countLast20Mins} 트윗`,
                description: "",
                url: "",
                guid: "1",
                categories: ["none"],
                author: "Qwreey",
                date: now
            })
            newFeed.item({
                title: `10 분동안 ${apiResult.countLast10Mins} 트윗`,
                description: "",
                url: "",
                guid: "1",
                categories: ["none"],
                author: "Qwreey",
                date: now
            })
            newFeed.item({
                title: `5 분동안 ${apiResult.countLast5Mins} 트윗`,
                description: "",
                url: "",
                guid: "1",
                categories: ["none"],
                author: "Qwreey",
                date: now
            })

            reply.type("application/xml")
            reply.send(newFeed.xml())
        }
    })

    done()
}
