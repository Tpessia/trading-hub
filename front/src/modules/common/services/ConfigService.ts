import { StrictEnumDictionary } from "../models/Dictionary"
import { changeUrl } from "../utils/url.utils"

type envs = 'DEV' | 'PROD'

interface Configs {
    apiUrl: string,
    wsUrl: string
}

export default abstract class ConfigService {
    static env: envs = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'

    private static configs: StrictEnumDictionary<envs, Configs> = {
        DEV: {
            apiUrl: 'http://localhost:3001/',
            wsUrl: 'ws://localhost:3001/'
        },
        PROD: {
            apiUrl: window.location.origin,
            wsUrl: changeUrl(window.location.origin, { protocol: 'ws' })
        }
    }

    static get config() {
        return ConfigService.configs[ConfigService.env]
    }
}