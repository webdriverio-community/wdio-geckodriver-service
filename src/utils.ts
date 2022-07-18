import path from 'node:path'
import { Capabilities } from '@wdio/types'

const FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i

export function isFirefox (cap: Capabilities.Capabilities) {
    return cap.browserName?.toLowerCase().includes('firefox') || false
}

/**
 * Resolves the given path into a absolute path and appends the
 * default filename as fallback when the provided path is a directory.
 *
 * @param  {String} logPath         relative file or directory path
 * @param  {String} defaultFilename default file name when filePath is a directory
 * @return {String}                 absolute file path
 */
export function getFilePath (filePath: string, defaultFilename: string) {
    let absolutePath = path.resolve(filePath)
    if (!FILE_EXTENSION_REGEX.test(path.basename(absolutePath))) {
        absolutePath = path.join(absolutePath, defaultFilename)
    }
    return absolutePath
}
