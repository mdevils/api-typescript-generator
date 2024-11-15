const lockedKeys: Record<string, Promise<unknown>> = {};

export function lock<T>(keyName: string, callback: () => Promise<T>): Promise<T> {
    const promise = (lockedKeys[keyName] ?? Promise.resolve())
        .then(
            () => callback(),
            () => callback()
        )
        .finally(() => {
            if (lockedKeys[keyName] === promise) {
                delete lockedKeys[keyName];
            }
        });
    lockedKeys[keyName] = promise;
    return promise;
}
