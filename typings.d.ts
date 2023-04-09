export {}



declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string,
            mongoUri: string,
            appPath: string
        }
    }
}

