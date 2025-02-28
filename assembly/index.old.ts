import { StringSink } from 'as-string-sink'
import { DynamicObject } from './DynamicObject'
import { Unknown, UnknownTypes } from './Unknown'
export { Unknown, UnknownTypes } from './Unknown'
export { DynamicObject as Object } from './DynamicObject'

@global
export class Nullable { }

const quote = '"'
const lbracket = "["
const rbracket = "]"
const rcbracket = "}"
const lcbracket = "{"
const trueVal = "true"
const falseVal = "false"
const nullVal = "null"
const escapeQuote = '\\"'
const quoteCode: u16 = 34// '"'
const commaCode: u16 = 44// ","
const rbracketCode: u16 = 93// "]"
const lbracketCode: u16 = 91// "["
const rcbracketCode: u16 = 125// "}"
const lcbracketCode: u16 = 123// "{"
const colonCode: u16 = 58// ":"
const fwd_slashCode: u16 = 92// "/"
const t_charCode: u16 = 116// "t"
const f_charCode: u16 = 116// "t"
const nCode: u16 = 110// "n"
const UnknownId = idof<Unknown>()
const stringId = idof<string>()
const objectId = idof<DynamicObject>()
const arrayStringId = idof<string[]>()
const arrayBooleanId = idof<boolean[]>()
const arrayBoolId = idof<bool[]>()
const arrayU8Id = idof<u8[]>()
const arrayU16Id = idof<u16[]>()
const arrayU32Id = idof<u32[]>()
const arrayU64Id = idof<u64[]>()
const arrayI8Id = idof<i8[]>()
const arrayI16Id = idof<i16[]>()
const arrayI32Id = idof<i32[]>()
const arrayI64Id = idof<i64[]>()
const arrayF32Id = idof<f32[]>()
const arrayF64Id = idof<f64[]>()
const arrayUnknownId = idof<Unknown[]>()
const WS1code = " ".charCodeAt(0)
const WS2code = '\u0020'.charCodeAt(0)
const WS3code = '\u000A'.charCodeAt(0)
const WS4code = '\u000D'.charCodeAt(0)
const WS5code = '\u0009'.charCodeAt(0)
const UnknownTrue = Unknown.wrap(true)
const UnknownFalse = Unknown.wrap(false)
const UnknownNull = Unknown.wrap(null)
const fwd_slash = "\\"
const empty_stringCode = " ".charCodeAt(0)

/**
 * JSON Encoder/Decoder for AssemblyScript
 */
export namespace JSON {
  /**
   * Stringifies valid JSON data.
   * ```js
   * JSON.stringify<T>(data)
   * ```
   * @param data Unknown
   * @returns string
  */
  export function stringify<T = Nullable>(data: T): string {
    // @ts-ignore
    if (isString(data)) {
      return serializeString(<string>data)
    } else if (isBoolean(data)) {
      return serializeBoolean(data)
      // @ts-ignore
    } else if (isNullable(data) && data == null) {
      return nullVal
    } else if (isFloat(data) || isInteger(data)) {
      return data.toString()
    } else if (isArrayLike(data)) {
      // @ts-ignore
      return serializeArray<T>(data)
    } else if (data instanceof Unknown) {
      return serializeUnknown(data)
    } else if (data instanceof DynamicObject) {
      return serializeDynamicObject(data)
    }

    // @ts-ignore
    if (data.__encoded.length === 0) data.__encode()
    // @ts-ignore
    return lcbracket + data.__encoded + rcbracket
  }
  /**
   * Parses valid JSON strings into their original format.
   * Useful for exchanging data and cloning.
   * ```js
   * JSON.parse<T>(data)
   * ```
   * @param data string
   * @returns T
   */
  export function parse<T = Nullable>(data: string): T {
    const char = data.charCodeAt(0)
    let type!: T
    // @ts-ignore
    if (isString<T>()) return parseString(data.trim())
    // @ts-ignore
    else if (isBoolean<T>()) return parseBoolean(data.trimLeft())
    // @ts-ignore
    else if (isArrayLike<T>()) return parseArray<T>(data)
    // @ts-ignore
    else if (isNullable<T>() && char === nCode) return null
    // @ts-ignore
    else if (isFloat<T>() || isInteger<T>()) return parseNumber<T>(data.trim())
    // @ts-ignore
    else if (type instanceof Unknown) return parseUnknown(data)
    // @ts-ignore
    else if (type instanceof DynamicObject) return parseDynamicObject(data)
    // @ts-ignore
    return parseObject<T>(data)
  }
}

export function serializeDynamicObject(data: DynamicObject): string {
  const result = new StringSink(lcbracket)
  const keys = DynamicObject.keys(data)
  const values = DynamicObject.values(data)
  const len: u32 = keys.length - 1
  if (len === -1) return '{}'
  for (let i: u32 = 0; i < len; i++) {
    result.write(`"${unchecked(keys[i])}":${serializeUnknown(unchecked(values[i]))},`)
  }
  result.write(`"${unchecked(keys[len])}":${serializeUnknown(unchecked(values[len]))}}`)
  return result.toString()
}

export function serializeUnknown(data: Unknown): string {
  // @ts-ignore
  if (data.type === UnknownTypes.null) {
    return nullVal
  }
  // @ts-ignore
  else if (data.type === UnknownId) {
    // @ts-ignore
    return serializeUnknown(data.get<Unknown>())
  }
  // @ts-ignore
  else if (data.type === stringId) {
    // @ts-ignore
    return serializeString(data.get<string>())
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.boolean) {
    // @ts-ignore
    return serializeBoolean(data.get<boolean>())
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.i8) {
    // @ts-ignore
    return data.get<i8>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.i16) {
    // @ts-ignore
    return data.get<i16>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.i32) {
    // @ts-ignore
    return data.get<i32>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.i64) {
    // @ts-ignore
    return data.get<i64>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.u8) {
    // @ts-ignore
    return data.get<u8>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.u16) {
    // @ts-ignore
    return data.get<u16>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.u32) {
    // @ts-ignore
    return data.get<u32>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.u64) {
    // @ts-ignore
    return data.get<u64>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.f32) {
    // @ts-ignore
    return data.get<f32>().toString()
  }
  // @ts-ignore
  else if (data.type === UnknownTypes.f64) {
    // @ts-ignore
    return data.get<f64>().toString()
  }
  // @ts-ignore
  else if (data.type === objectId) {
    // @ts-ignore
    return serializeDynamicObject(data.get<DynamicObject>())
  }
  // @ts-ignore
  else if (data.type === arrayUnknownId) {
    // @ts-ignore
    return serializeUnknownArray(data.get<Unknown[]>())
  }
  // @ts-ignore
  else if (data.type === arrayBoolId) {
    // @ts-ignore
    return serializeBooleanArray(data.get<bool[]>())
  }
  // @ts-ignore
  else if (data.type === arrayBooleanId) {
    // @ts-ignore
    return serializeBooleanArray(data.get<boolean[]>())
  }
  // @ts-ignore
  else if (data.type === arrayF32Id) {
    // @ts-ignore
    return serializeNumberArray<f32[]>(data.get<f32[]>())
  }
  // @ts-ignore
  else if (data.type === arrayF64Id) {
    // @ts-ignore
    return serializeNumberArray<f64[]>(data.get<f64[]>())
  }
  // @ts-ignore
  else if (data.type === arrayU8Id) {
    // @ts-ignore
    return serializeNumberArray<u8[]>(data.get<u8[]>())
  }
  // @ts-ignore
  else if (data.type === arrayU16Id) {
    // @ts-ignore
    return serializeNumberArray<u16[]>(data.get<u16[]>())
  }
  // @ts-ignore
  else if (data.type === arrayU32Id) {
    // @ts-ignore
    return serializeNumberArray<u32[]>(data.get<u32[]>())
  }
  // @ts-ignore
  else if (data.type === arrayU64Id) {
    // @ts-ignore
    return serializeNumberArray<u64[]>(data.get<u64[]>())
  }
  // @ts-ignore
  else if (data.type === arrayI8Id) {
    // @ts-ignore
    return serializeNumberArray<i8[]>(data.get<i8[]>())
  }
  // @ts-ignore
  else if (data.type === arrayI16Id) {
    // @ts-ignore
    return serializeNumberArray<i16[]>(data.get<i16[]>())
  }
  // @ts-ignore
  else if (data.type === arrayI32Id) {
    // @ts-ignore
    return serializeNumberArray<i32[]>(data.get<i32[]>())
  }
  // @ts-ignore
  else if (data.type === arrayI64Id) {
    // @ts-ignore
    return serializeNumberArray<i64[]>(data.get<i64[]>())
  }
  // @ts-ignore
  else if (data.type === arrayStringId) {
    // @ts-ignore
    return serializeStringArray(data.get<string[]>())
  }
  // @ts-ignore
  else {
    return nullVal
  }
}

export function serializeNumber<T>(data: T): string {
  // @ts-ignore
  return data.toString()
}

export function serializeString(data: string): string {
  return quote + data.replaceAll(quote, escapeQuote) + quote
}

export function serializeBoolean(data: number): string {
  return data ? trueVal : falseVal
}

function serializeStringArray(data: string[]): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    result.write(serializeString(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  result.write(serializeString(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeNumberArray<T extends Array<any>>(data: T): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    result.write(serializeNumber<valueof<T>>(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  result.write(serializeNumber<valueof<T>>(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeBooleanArray(data: boolean[]): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    // @ts-ignore
    result.write(serializeBoolean(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  // @ts-ignore
  result.write(serializeBoolean(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeUnknownArray(data: Unknown[]): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    result.write(serializeUnknown(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  result.write(serializeUnknown(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeDeepArray<T extends Array<any>>(data: T): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    result.write(serializeArray<valueof<T>>(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  result.write(serializeArray<valueof<T>>(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeObjectArray<T extends Array<any>>(data: T): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  let obj!: valueof<T>
  for (let i: u32 = 0; i < len; i++) {
    obj = unchecked(data[i])
    if (obj.__encoded.length === 0) obj.__encode()
    result.write(obj.__encoded)
    result.writeCodePoint(commaCode)
  }
  obj = unchecked(data[len])
  if (obj.__encoded.length === 0) obj.__encode()
  result.write(obj.__encoded)
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

function serializeDynamicObjectArray(data: DynamicObject[]): string {
  const result = new StringSink(lbracket)
  const len: u32 = data.length - 1
  for (let i: u32 = 0; i < len; i++) {
    result.write(serializeDynamicObject(unchecked(data[i])))
    result.writeCodePoint(commaCode)
  }
  result.write(serializeDynamicObject(unchecked(data[len])))
  result.writeCodePoint(rbracketCode)
  return result.toString()
}

export function serializeArray<T extends Array<any>>(data: T): string {
  let type!: valueof<T>
  const len = data.length - 1;
  if (len === -1) return lbracket + rbracket
  let result = new StringSink(lbracket);
  if (isString<valueof<T>>()) {
    for (let i = 0; i < len; i++) {
      result.write(serializeString(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeString(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
  } else if (isFloat<valueof<T>>() || isInteger<valueof<T>>()) {
    for (let i = 0; i < len; i++) {
      result.write(serializeNumber<valueof<T>>(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeNumber<valueof<T>>(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
  } else if (isBoolean<valueof<T>>()) {
    for (let i = 0; i < len; i++) {
      result.write(serializeBoolean(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeBoolean(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
    // @ts-ignore
  } else if (type instanceof Unknown) {
    for (let i = 0; i < len; i++) {
      result.write(serializeUnknown(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeUnknown(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
  } else if (isArray<valueof<T>>()) {
    for (let i = 0; i < len; i++) {
      result.write(serializeArray<valueof<T>>(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeArray<valueof<T>>(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
    // @ts-ignore
  } else if (type instanceof DynamicObject) {
    for (let i = 0; i < len; i++) {
      result.write(serializeDynamicObject(unchecked(data[i])))
      result.writeCodePoint(commaCode)
    }
    result.write(serializeDynamicObject(unchecked(data[len])))
    result.writeCodePoint(rbracketCode)
    return result.toString()
  } else {
    for (let i = 0; i < len; i++) {
      const elem = unchecked(data[i])
      // @ts-ignore
      if (elem.__encoded.length === 0) elem.__encode()
    }
    // @ts-ignore
    result.write(elem.__encoded)
    result.writeCodePoint(rcbracketCode)
  }
  return result.toString()
}

export function parseUnknown(data: string): Unknown {
  const char = data.charCodeAt(0)
  // @ts-ignore
  if (char === quoteCode) return Unknown.wrap(parseString(data))
  // @ts-ignore
  else if (char === t_charCode) return UnknownTrue
  else if (char === f_charCode) return UnknownFalse
  // @ts-ignore
  else if (char === lbracketCode) return Unknown.wrap(parseUnknownArray(data))
  // @ts-ignore
  else if (char === nCode) return UnknownNull
  // @ts-ignore
  //else if (char === lcbracketCode) return parseObject<T>(data)
  // @ts-ignore
  return parseUnknownNumber(data)
}


export function parseBoolean(data: string): boolean {
  return data.charCodeAt(0) === t_charCode ? true : false
}

export function parseString(data: string): string {
  return data.slice(1, data.length - 1).replaceAll(escapeQuote, quote)
}

export function parseNumber<T>(data: string): T {
  let type: T
  // @ts-ignore
  if (type instanceof f64) return F64.parseFloat(data)
  // @ts-ignore
  else if (type instanceof f32) return F32.parseFloat(data)
  // @ts-ignore
  else if (type instanceof i32) return I32.parseInt(data)
  // @ts-ignore
  else if (type instanceof u32) return U32.parseInt(data)
  // @ts-ignore
  else if (type instanceof u64) return U64.parseInt(data)
  // @ts-ignore
  else if (type instanceof i64) return I64.parseInt(data)
  // @ts-ignore
  else if (type instanceof u8) return U8.parseInt(data)
  // @ts-ignore
  else if (type instanceof u16) return U16.parseInt(data)
  // @ts-ignore
  else if (type instanceof i16) return I16.parseInt(data)
  // @ts-ignore
  return I8.parseInt(data)
}

export function parseUnknownNumber(data: string): Unknown {
  // @ts-ignore
  if (data.includes('.')) return Unknown.wrap(F64.parseFloat(data))
  // @ts-ignore
  return Unknown.wrap(I64.parseInt(data))
}

export function parseArray<T extends Array<Unknown>>(data: string): T {
  let type!: valueof<T>
  // @ts-ignore
  if (isString<valueof<T>>()) return parseStringArray(data)
  // @ts-ignore
  else if (isBoolean<valueof<T>>()) return parseBooleanArray(data)
  // @ts-ignore
  else if (isArray<valueof<T>>()) return parseArrayArray<T>(data)
  // @ts-ignore
  else if (type instanceof Unknown) return parseUnknownArray(data)
  // @ts-ignore
  return parseNumberArray<valueof<T>>(data)
}

export function parseStringArray(data: string): Array<string> {
  const result = new Array<string>()
  if (data.length === 2) return result
  let lastPos: u32 = 1
  let char: u32 = 0
  let instr: boolean = false
  for (let i: u32 = 1; i < u32(data.length - 1); i++) {
    char = data.charCodeAt(i)
    // This ignores [ and ] or { and } if they are inside a string.
    if (char === quoteCode && data.charCodeAt(i - 1) !== fwd_slashCode) instr = instr ? false : true
    if (instr === false) {
      // Handles whitespace after a comma
      if (char === WS1code || char === WS2code || char === WS3code || char === WS4code || char === WS5code) lastPos++
      if (char === quoteCode) {
        result.push(parseString(data.slice(lastPos, i + 1)))
        lastPos = i + 2
      }
    }
  }
  return result
}

export function parseBooleanArray(data: string): Array<boolean> {
  const result = new Array<boolean>()
  if (data.length === 2) return result
  let char: u32 = 0
  let instr: boolean = false
  for (let i: u32 = 1; i < u32(data.length - 1); i++) {
    char = data.charCodeAt(i)
    if (instr === false) {
      if (char === t_charCode) {
        result.push(true)
        i += 4
      } else {
        result.push(false)
        i += 5
      }
    }
  }
  return result
}

export function parseNumberArray<T>(data: string): Array<T> {
  const result = new Array<T>()
  if (data.length === 2) return result
  let lastPos: u32 = 0
  let char: u32 = 0
  let i: u32 = 1
  for (; i < u32(data.length - 1); i++) {
    char = data.charCodeAt(i)
    if (char === commaCode) {
      //console.log('Found number: ' + data.slice(lastPos + 1, i))
      result.push(parseNumber<T>(data.slice(lastPos + 1, i)))
      lastPos = i
    }
  }
  // console.log('Found number: ' + data.slice(lastPos + 1, i))
  result.push(parseNumber<T>(data.slice(lastPos + 1, i)))
  return result
}

export function parseUnknownArray(data: string): Array<Unknown> {
  const result = new Array<Unknown>()
  if (data.length === 2) return result
  let lastPos: i32 = 0
  let char: u32 = 0
  let depth: u32 = 0
  let fdepth: u32 = 0
  let instr: boolean = false
  let i: u32 = 1
  for (; i < u32(data.length - 1); i++) {
    char = data.charCodeAt(i)
    // This ignores [ and ] if they are inside a string.
    if (char === quoteCode && data.charCodeAt(i - 1) !== fwd_slashCode) {
      if (instr === true) {
        instr = false
      } else {
        instr = true
      }
    }
    if (instr === false) {
      if (char === commaCode && depth === 0 && fdepth === 0) {
        //console.log('Normal chunk: ' + data.slice(lastPos + 1, i))
        result.push(parseUnknown(data.slice(lastPos + 1, i).trim()))
        lastPos = i
      } else if (char === lbracketCode) depth++
      else if (char === rbracketCode) fdepth++
      else if (depth !== 0 && depth === fdepth) {
        //console.log('Deep chunk: ' + data.slice(lastPos + 1, i))
        result.push(Unknown.wrap(parseUnknownArray(data.slice(lastPos + 1, i).trim())))
        // Reset the depth
        depth = 0
        fdepth = 0
        // Set new lastPos
        lastPos = i
      }
    }
  }
  // console.log('Last chunk: ' + data.slice(lastPos + 1, data.length - 1).trim())
  result.push(parseUnknown(data.slice(lastPos + 1, data.length - 1).trim()))
  return result
}

export function parseArrayArray<T extends Array<Unknown>>(data: string): T {
  const result = instantiate<T>()
  if (data.length === 2) return result
  let lastPos: i32 = -1
  let char: u32 = 0
  let depth: u32 = 0
  let fdepth: u32 = 0
  let instr: u32 = 0
  for (let i: u32 = 1; i < u32(data.length - 1); i++) {
    char = data.charCodeAt(i)
    // This ignores [ and ] if they are inside a string.
    if (char === quoteCode && data.charCodeAt(i - 1) !== fwd_slashCode) instr = instr ? 0 : 1
    // This gets the depth of the array.
    if (instr === 0) {
      if (char === lbracketCode) depth++
      if (char === rbracketCode) fdepth++
      // If the depth and found depth are equal, that is an array. Push it.
      if (depth !== 0 && depth === fdepth) {
        result.push(
          // @ts-ignore
          parseArray<valueof<T>>(data.slice(lastPos + 2, i + 1))
        )
        // Reset the depth
        depth = 0
        fdepth = 0
        // Set new lastPos
        lastPos = i
      }
    }
  }
  // Return the final array
  return result
}

export function parseObject<T>(data: string): T {
  //console.log('Data ' + data)
  data = removeJSONWhitespace(data)
  const len: u32 = data.length - 1
  let schema: T
  const result = new Map<string, string>()
  let lastPos: u32 = 1
  let key: string = ''
  let instr: u32 = 0
  let char: u32 = 0
  let depth: u32 = 0
  let fdepth: u32 = 0
  for (let i: u32 = 1; i < len; i++) {
    char = data.charCodeAt(i)
    if (char === quoteCode && data.charCodeAt(i - 1) !== fwd_slashCode) instr = (instr ? 0 : 1)
    else if (instr === 0) {
      if (char === lcbracketCode || char === lbracketCode) depth++
      if (char === rcbracketCode || char === rbracketCode) fdepth++
    }
    if (depth !== 0 && depth === fdepth) {
      //console.log(`Deep: ${data.slice(lastPos + 1, i + 1)}`)
      result.set(key, data.slice(lastPos + 1, i + 1).trim())
      // Reset the depth
      depth = 0
      fdepth = 0
      // Set new lastPos
      lastPos = i + 1
    }
    if (depth === 0) {
      if (char === colonCode) {
        //console.log(`Key: ${data.slice(lastPos + 1, i - 1)}`)
        key = data.slice(lastPos + 1, i - 1).trim()
        lastPos = i
      }
      else if (char === commaCode) {
        //console.log(`Value: ${data.slice(lastPos + 1, i)}`)
        if ((i - lastPos) > 0) result.set(key, data.slice(lastPos + 1, i).trim())
        lastPos = i + 1
      }
    }
  }
  //console.log(`Trailing: ${data.slice(lastPos + 1, len)}\n\t\sValid: ${data.slice(lastPos + 1, len).length > 0}`)

  if ((len - lastPos) > 0) result.set(key, data.slice(lastPos + 1, len).trim())
  // @ts-ignore
  return schema.__decode(result)
}

export function parseDynamicObject(data: string): DynamicObject {
  const len: u32 = data.length - 1
  if (len === 1) return new DynamicObject()
  const result = new Map<string, Unknown>()
  let lastPos: u32 = 1
  let key: string = ''
  let instr: u32 = 0
  let char: u32 = 0
  let depth: u32 = 0
  let fdepth: u32 = 0
  for (let i: u32 = 1; i < len; i++) {
    char = data.charCodeAt(i)
    if (char === quoteCode && data.charCodeAt(i - 1) !== fwd_slashCode) instr = (instr ? 0 : 1)
    else if (instr === 0) {
      if (char === lcbracketCode || char === lbracketCode) depth++
      if (char === rcbracketCode || char === rbracketCode) fdepth++
    }
    if (depth !== 0 && depth === fdepth) {
      result.set(key, Unknown.wrap(data.slice(lastPos + 1, i + 1).trim()))
      // Reset the depth
      depth = 0
      fdepth = 0
      // Set new lastPos
      lastPos = i + 2
    }
    if (depth === 0) {
      if (char === colonCode) {
        key = data.slice(lastPos + 1, i - 1).trim()
        lastPos = i + 1
      }
      else if (char === commaCode) {
        if ((i - lastPos) > 0) result.set(key, Unknown.wrap(data.slice(lastPos + 1, i).trim()))
        lastPos = i + 1
      }
    }
  }

  if ((len - lastPos) > 0) result.set(key, Unknown.wrap(data.slice(lastPos + 1, len - 1).trim()))
  const o = new DynamicObject()
  // @ts-ignore
  o.__data = result
  return o
}

export function removeJSONWhitespace(data: string): string {
  let result = new StringSink()
  let instr = false
  let char = 0
  for (let i = 0; i < data.length; i++) {
    char = data.charCodeAt(i)
    if (char === quoteCode && data.charCodeAt(i - 1) === fwd_slashCode) {
      instr = !instr
    }
    if (instr === true) {
      result.writeCodePoint(char)
    } else if (instr === false && char !== empty_stringCode) {
      result.writeCodePoint(char)
    }
  }
  return result.toString()
}