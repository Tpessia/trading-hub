interface ChangeUrlConfig {
    port?: string,
    protocol?: string
}

export function changeUrl(baseUrl: string, config: ChangeUrlConfig) {
    const url = new URL(baseUrl)

    if (config.port) url.port = config.port
    if (config.protocol) url.protocol = config.protocol

    return url.toString()
}