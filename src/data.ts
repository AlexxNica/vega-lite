/*
 * Constants and utilities for data.
 */

export interface DataFormat {
  /**
   * Type of input data: `"json"`, `"csv"`, `"tsv"`.
   * The default format type is determined by the extension of the file url.
   * If no extension is detected, `"json"` will be used by default.
   */
  type?: DataFormatType;

  /**
   * A collection of parsing instructions can be used to define the data types of string-valued attributes in the JSON file. Each instruction is a name-value pair, where the name is the name of the attribute, and the value is the desired data type (one of `"number"`, `"boolean"` or `"date"`). For example, `"parse": {"modified_on":"date"}` ensures that the `modified_on` value in each row of the input data is parsed as a Date value. (See Datalib's [`dl.read.types` method](https://github.com/vega/datalib/wiki/Import#dl_read_types) for more information.)
   */
  parse?: any;

  /**
   * JSON only) The JSON property containing the desired data.
   * This parameter can be used when the loaded JSON file may have surrounding structure or meta-data.
   * For example `"property": "values.features"` is equivalent to retrieving `json.values.features`
   * from the loaded JSON object.
   */
  property?: string;

  /**
   * The name of the TopoJSON object set to convert to a GeoJSON feature collection.
   * For example, in a map of the world, there may be an object set named `"countries"`.
   * Using the feature property, we can extract this set and generate a GeoJSON feature object for each country.
   */
  feature?: string;
  /**
   * The name of the TopoJSON object set to convert to a mesh.
   * Similar to the `feature` option, `mesh` extracts a named TopoJSON object set.
   *  Unlike the `feature` option, the corresponding geo data is returned as a single, unified mesh instance, not as individual GeoJSON features.
   * Extracting a mesh is useful for more efficiently drawing borders or other geographic elements that you do not need to associate with specific regions such as individual countries, states or counties.
   */
  mesh?: string;
}

export type DataFormatType = 'json' | 'csv' | 'tsv' | 'topojson';

export type Data = UrlData | InlineData;

export interface UrlData {
  /**
   * An object that specifies the format for the data file or values.
   */
  format?: DataFormat;

  /**
   * A URL from which to load the data set. Use the format.type property
   * to ensure the loaded data is correctly parsed.
   */
  url: string;
}

export interface InlineData {
  /**
   * Pass array of objects instead of a url to a file.
   */
  values: any[];
}

export function isUrlData(data: Data): data is UrlData {
  return !!data['url'];
}

export function isInlineData(data: Data): data is InlineData {
  return !!data['values'];
}

export type DataSourceType = 'source' | 'summary' | 'stacked' | 'layout';

export const SUMMARY: 'summary' = 'summary';
export const SOURCE: 'source' = 'source';
export const STACKED: 'stacked' = 'stacked';
export const LAYOUT: 'layout' = 'layout';
