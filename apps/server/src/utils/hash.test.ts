import {describe, expect, test} from 'bun:test'
import { getSha256Hash } from './hash'

describe('getSha256Hash', () => {
  test('hash string', () => {
    const url = 'https://fyndx.io'
    expect(getSha256Hash(url)).toBe('373c78fbd0749c68178c505ee70d3094d05acf3e12562830cccc7c46b3f09a06')
  })
})
