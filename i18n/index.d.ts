declare module '@foo/i18n' {
  /**
   * Available translations:
   * - `de_DE`: Hallo foo.
   * - `en_US`: Hello foo.
   */
  export function foo(): string;

  /**
   * Available translations:
   * - `de_DE`: Hallo bar.
   * - `en_US`: Hello bar.
   */
  export function bar(): string;
}
