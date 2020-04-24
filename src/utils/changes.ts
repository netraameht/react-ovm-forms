import {FormError, Path, PathNodeType} from "../types";
import {isObject} from "./path";

function mergeArrays<T>(...arrays: T[][]): T[] {
  return arrays.reduce((acc, val) => [...acc, ...val], []);
}

export function createChangesMap(currentPath: Path, value: any): { path: Path, value: any }[] {
  if (Array.isArray(value) && value.length > 0) {
    return mergeArrays(...value.map((value, index) => createChangesMap([...currentPath, [PathNodeType.ARRAY_INDEX, index]], value)));
  } else if (isObject(value) && !Array.isArray(value) && Object.entries(value).length > 0) {
    return mergeArrays(...Object.entries(value).map(([key, value]) => createChangesMap([...currentPath, [PathNodeType.OBJECT_KEY, key]], value)));
  } else {
    return [{path: currentPath, value}];
  }
}

function isFormError(error: any): error is FormError {
  return typeof error === "string" || error instanceof Error;
}

export function createErrorsMap(currentPath: Path, error: any): { path: Path, error: FormError }[] {
  if (Array.isArray(error) && error.length > 0) {
    return mergeArrays(...error.map((value, index) => createErrorsMap([...currentPath, [PathNodeType.ARRAY_INDEX, index]], value)));
  } else if (isObject(error) && !Array.isArray(error) && Object.entries(error).length > 0) {
    return mergeArrays(...Object.entries(error).map(([key, value]) => createErrorsMap([...currentPath, [PathNodeType.OBJECT_KEY, key]], value)));
  } else if (isFormError(error)) {
    return [{path: currentPath, error}];
  } else {
    return [];
  }
}