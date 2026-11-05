import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom reports en-US: the tests start from a French browser unless they say otherwise.
beforeEach(() => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-BE')
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})
