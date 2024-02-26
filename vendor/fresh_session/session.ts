export class Session {
  #data = new Map();
  #flash = new Map();
  #doDelete = false;
  #doKeyRotate = false;

  constructor(data = {}, flash = {}) {
    this.#data = new Map(Object.entries(data));
    this.#flash = new Map(Object.entries(flash));
  }

  get data(): any {
    return Object.fromEntries(this.#data);
  }

  get flashedData(): any {
    return Object.fromEntries(this.#flash);
  }

  get doDelete(): boolean {
    return this.#doDelete;
  }

  get doKeyRotate(): boolean {
    return this.#doKeyRotate;
  }

  set(key: string, value: any): this {
    this.#data.set(key, value);

    return this;
  }

  get(key: string): any {
    return this.#data.get(key);
  }

  has(key: string): boolean {
    return this.#data.has(key);
  }

  clear(): this {
    this.#data.clear();
    return this;
  }

  flash(key: string, value?: any): any {
    if (value === undefined) {
      const flashedValue = this.#flash.get(key);

      this.#flash.delete(key);

      return flashedValue;
    }
    this.#flash.set(key, value);

    return this;
  }

  destroy() {
    this.#doDelete = true;
  }

  keyRotate() {
    this.#doKeyRotate = true;
  }
}
