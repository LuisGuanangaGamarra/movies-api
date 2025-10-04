export class DomainException<TContext = Record<string, unknown>> extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly context?: TContext,
    public readonly status?: number,
  ) {
    super(message);
  }
}
