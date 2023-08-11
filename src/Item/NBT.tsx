import { IValue } from 'nbtrock';
export type Base = 'Byte' | 'Double' | 'Float' | 'Int' | 'Long' | 'Short' | 'String';
export type TArray = 'ByteArray' | 'IntArray' | 'LongArray';
// type Other = 'Boolean' | 'White' | 'Void';
export type Complex = 'Compound' | 'List';
export type NBTTYPE = Base | TArray | Complex;

export function CrateValue(type: NBTTYPE, value: any): IValue {
  const obj = {};
  Reflect.set(obj, type, value);
  return obj as IValue;
}
