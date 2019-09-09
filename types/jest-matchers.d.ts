declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveFocus(
        highlightInfo: { id: string; offset: number; length: number },
        rootElement: HTMLElement
      ): R;
    }
  }
}
