export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Receives a string and normalizes it to a slug.
   *
   * Example: "Hello, World!" -> "hello-world"
   *
   * @param text
   */
  static createFromText(text: string): Slug {
    const normalizedText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/, '');

    return new Slug(normalizedText);
  }
}
