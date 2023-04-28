import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import '@testing-library/jest-dom'
import getIP from '../src/pages/index'

import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

describe('API', () => {
    test('Get IP', async () => {
        let result = await getIP();
        expect(result).toBe("::1")
    })
})