import 'wasi'

import { Date } from 'as-wasi'

import { JSON } from '.'

import * as asJSON from "assemblyscript-json"

import { Unknown } from './Unknown'
import { DynamicObject } from './DynamicObject'

// @ts-ignore
@json
class JSONSchema {
    hello: string
}

const jsonData: JSONSchema = {
    hello: 'world'
}

const o = new DynamicObject()

o['hello'] = Unknown.wrap('world')

export function bench(title: string, code: () => void): void {
    let ops: u32 = 100_000
    const start: f64 = Date.now()
    while (ops--) {
        code()
    }
    const time: f64 = Date.now() - start
    if (time <= 0) {
        console.log(`${title}: ~${100_000 * 1000}.00 ops/s | ${Math.round((time * 100)) / 100}ms`)
    } else {
        console.log(`${title}: ~${Math.round(((100_000 * 1000) / time) * 100) / 100} ops/s | ${Math.round((time * 100)) / 100}ms`)
    }
}

bench('AS-JSON Stringify String', () => {
    JSON.stringify<string>('Hello World')
})

bench('AS-JSON Parse String', () => {
    JSON.parse<string>('"Hello World"')
})

bench('AS-JSON Stringify Integer', () => {
    JSON.stringify<i32>(14)
})

bench('AS-JSON Parse Integer', () => {
    JSON.parse<i32>('14')
})

bench('AS-JSON Stringify Float', () => {
    JSON.stringify<f64>(7.3)
})

bench('AS-JSON Parse Float', () => {
    JSON.parse<f64>('7.3')
})

bench('AS-JSON Stringify Boolean', () => {
    JSON.stringify<boolean>(true)
})

bench('AS-JSON Parse Boolean', () => {
    JSON.parse<boolean>('true')
})

bench('AS-JSON Stringify Array', () => {
    JSON.stringify<boolean[]>([true, false, true])
})

bench('AS-JSON Parse Array', () => {
    JSON.parse<boolean[]>('[true,false,true]')
})

bench('AS-JSON Stringify Object', () => {
    JSON.stringify<JSONSchema>(jsonData)
})

bench('AS-JSON Parse Object', () => {
    JSON.parse<JSONSchema>('{"hello":"world"}')
})

bench('AS-JSON Stringify Dynamic Object', () => {
    JSON.stringify<DynamicObject>(o)
})

bench('AS-JSON Parse Object', () => {
    JSON.parse<DynamicObject>('{"hello":"world"}')
})

bench('AS-JSON Stringify Dynamic Array', () => {
    JSON.stringify<Unknown[]>(["Welcome to dynamic arrays", true])
})

bench('AS-JSON Parse Dynamic Array', () => {
    JSON.parse<Unknown[]>('["Welcome to dynamic arrays",true]')
})

bench('AS-JSON Stringify Dynamic Array', () => {
    JSON.stringify<string[]>(["hello", "world"])
})
bench('AS-JSON Parse Dynamic Array', () => {
    JSON.parse<string[]>('["hello","hello"]')
})

/*
bench('AssemblyScript-JSON Stringify String', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.setString(null, "Hello World")
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
    // Its odd. Not encoded in UTF16 Strings.
    // Since AS-JSON returns a string, so does assemblyscript-json in this bench.
    // Or else, the bench is biased.
})

bench('AssemblyScript-JSON Parse String', () => {
    const decoder: asJSON.JSON.Str = <asJSON.JSON.Str>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('"Hello World"'))))
    decoder.valueOf()
})

bench('AssemblyScript-JSON Stringify Integer', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.setInteger(null, 14)
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
})

bench('AssemblyScript-JSON Parse Integer', () => {
    const decoder: asJSON.JSON.Integer = <asJSON.JSON.Integer>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('14'))))
    decoder.valueOf()
})

bench('AssemblyScript-JSON Stringify Float', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.setFloat(null, 7.3)
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
})

bench('AssemblyScript-JSON Parse Float', () => {
    const decoder: asJSON.JSON.Float = <asJSON.JSON.Float>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('7.3'))))
    decoder.valueOf()
})

bench('AssemblyScript-JSON Stringify Boolean', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.setBoolean(null, true)
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
})

bench('AssemblyScript-JSON Parse Boolean', () => {
    const decoder: asJSON.JSON.Bool = <asJSON.JSON.Bool>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('true'))))
    decoder.valueOf()
})

bench('AssemblyScript-JSON Stringify Array', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.pushArray(null)
    encoder.setBoolean(null, true)
    encoder.setBoolean(null, false)
    encoder.setBoolean(null, true)
    encoder.popArray()
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
})

bench('AssemblyScript-JSON Parse Array', () => {
    const decoder: asJSON.JSON.Arr = <asJSON.JSON.Arr>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('[true,false,true]'))))
    const result = decoder.valueOf()
    const pos0: asJSON.JSON.Bool = <asJSON.JSON.Bool>result.at(0)
    pos0.valueOf()
    const pos1: asJSON.JSON.Bool = <asJSON.JSON.Bool>result.at(1)
    pos1.valueOf()
    const pos2: asJSON.JSON.Bool = <asJSON.JSON.Bool>result.at(2)
    pos2.valueOf()
})

bench('AssemblyScript-JSON Stringify Object', () => {
    const encoder = new asJSON.JSONEncoder()
    encoder.pushObject(null)
    encoder.setBoolean('bool', true)
    encoder.popObject()
    const binary = encoder.serialize()
    String.UTF8.decode(binary.buffer)
})

bench('AssemblyScript-JSON Parse Object', () => {
    const decoder: asJSON.JSON.Obj = <asJSON.JSON.Obj>(asJSON.JSON.parse(Uint8Array.wrap(String.UTF8.encode('{"bool":true}'))))
    const result = decoder.getBool('bool')
    if (result !== null) result.valueOf()
})
*/