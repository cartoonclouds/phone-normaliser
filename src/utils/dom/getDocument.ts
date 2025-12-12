export function getDocument(): Document | null {
  if (typeof globalThis !== 'undefined' && globalThis.document) {
    return globalThis.document
  }

  if (typeof document !== 'undefined') {
    return document
  }

  return null
}
