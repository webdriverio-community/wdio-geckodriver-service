import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))
const packageJSONContent = (await fs.promises.readFile(path.resolve(dirname, '..', 'package.json'))).toString()
export const pkg = JSON.parse(packageJSONContent)

export const POLL_INTERVAL = 100
export const POLL_TIMEOUT = 10000
export const DEFAULT_PATH = '/'
export const LOCAL_OPTIONS = {
    protocol: 'http',
    hostname: '127.0.0.1'
}
