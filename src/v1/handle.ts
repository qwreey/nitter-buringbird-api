import {
    type instance
} from "../index"
import { Type } from '@sinclair/typebox'
import NitterBuringbirdAPI from "./api"

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

    done()
}
