import {objectExpression, ObjectExpression, objectProperty} from '@babel/types';
import {objectPropertyKey, valueToAstExpression} from '../schema-to-typescript/common';
import {OpenApiParameter, OpenApiParameterIn, OpenApiParameterStyle} from '../schemas/common';

const defaultParameterStyles: Record<OpenApiParameterIn, OpenApiParameterStyle> = {
    query: 'form',
    cookie: 'form',
    header: 'simple',
    path: 'simple'
};

const defaultParameterExplode: Record<OpenApiParameterStyle, boolean> = {
    form: true,
    spaceDelimited: false,
    pipeDelimited: false,
    deepObject: true,
    simple: false,
    label: false,
    matrix: false
};

type ParameterSerializeInfo =
    | {
          style: OpenApiParameterStyle;
          explode: boolean;
      }
    | {
          style: OpenApiParameterStyle;
      }
    | {
          explode: boolean;
      };

function getParameterSerializeInfo(parameter: OpenApiParameter): ParameterSerializeInfo | null {
    const {style = defaultParameterStyles[parameter.in], explode = defaultParameterExplode[style]} = parameter;
    if (style !== defaultParameterStyles[parameter.in]) {
        if (explode !== defaultParameterExplode[style]) {
            return {style, explode};
        }
        return {style};
    }
    if (explode !== defaultParameterExplode[style]) {
        return {explode};
    }
    return null;
}

export function buildParametersSerializationInfo(parameters: OpenApiParameter[]): ObjectExpression | null {
    const parameterInfoByLocation = parameters.reduce(
        (acc: {[K in OpenApiParameterIn]?: {name: string; info: ParameterSerializeInfo}[]}, parameter) => {
            const serializeInfo = getParameterSerializeInfo(parameter);
            if (!serializeInfo) {
                return acc;
            }
            let paramsInLocation = acc[parameter.in];
            if (!paramsInLocation) {
                paramsInLocation = acc[parameter.in] = [];
            }
            paramsInLocation.push({name: parameter.name, info: serializeInfo});
            return acc;
        },
        {}
    );
    if (Object.keys(parameterInfoByLocation).length === 0) {
        return null;
    }
    return objectExpression(
        Object.entries(parameterInfoByLocation).map(([location, parameters]) =>
            objectProperty(
                objectPropertyKey(location),
                objectExpression(
                    parameters.map(({name, info}) =>
                        objectProperty(objectPropertyKey(name), valueToAstExpression(info))
                    )
                )
            )
        )
    );
}
