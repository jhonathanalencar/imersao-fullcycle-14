import queryString from 'query-string';

const separator = '|';

export type serializerFunction = (any) => string | number | boolean;
export type serializerFormat = { [key: string]: serializerFunction };

export function serializer(
  format: serializerFormat,
  baseUrl: string,
  queryStringOptions: object = {
    arrayFormat: 'separator',
    arrayFormatSeparator: separator,
  },
) {
  return (params: { [key: string]: any }) => {
    // avoid mutating params
    const serializedParams = { ...params };

    Object.keys(format).forEach((key: string) => {
      if (key in serializedParams) {
        serializedParams[key] = format[key](serializedParams[key]);
      }
    });

    return queryString.stringify(serializedParams, queryStringOptions);
  };
}
