import "reflect-metadata"
import {DataSource} from "typeorm"
import {loadEnv} from "../utils/load-env";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

loadEnv()

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    cache: false,
    poolSize: 10,
    //synchronize: process.env.NODE_ENV === 'development',
    logging: ['error', 'schema', 'warn', "query"],
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/entities/*.ts'],
    migrations: [],
    subscribers: ['src/subscribers/*.ts'],
})
