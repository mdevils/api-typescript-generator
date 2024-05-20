export type JsonValue = JsonObject | JsonArray | string | number | boolean | null;
export interface JsonObject {
    [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];
