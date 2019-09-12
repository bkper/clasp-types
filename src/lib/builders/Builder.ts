export abstract class Builder {
  
  private text = '';

  append(text: string): Builder {
    this.text += text;
    return this;
  }

  doubleLine(): Builder {
    this.text += '\n\n';
    return this;
  }

  line(): Builder {
    this.text += '\n';
    return this;
  }

  getText(): string {
    return this.text;
  }

  protected abstract build(): Builder;

}
