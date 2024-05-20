const jsonMediaTypeTypeRegExp = /^application\/(\w+\+)?json/;

export function isJsonMediaType(mediaType: string) {
    return Boolean(mediaType.match(jsonMediaTypeTypeRegExp));
}

export function isWildcardMediaType(mediaType: string) {
    return mediaType.includes('*');
}
