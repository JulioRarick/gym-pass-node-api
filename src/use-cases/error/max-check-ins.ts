export class MaxCheckInsError extends Error {
  constructor() {
    super('User has reached maximum check-ins')
  }
}
