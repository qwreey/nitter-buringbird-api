import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import fastify from "fastify"
import { Type } from '@sinclair/typebox'
import { configDotenv } from "dotenv"

configDotenv()



const instance = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()
export type instance = typeof instance

import APIV1 from "./v1/handle"
instance.register(APIV1)

instance.listen({
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
})
