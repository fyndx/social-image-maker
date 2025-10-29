import {describe, expect, test} from 'bun:test'
import { getSha256Hash } from './hash'

describe('getSha256Hash', () => {
  test('hash string', () => {
    const url = 'https://fyndx.io'
    expect(getSha256Hash(url)).toMatchSnapshot()
  })
})
