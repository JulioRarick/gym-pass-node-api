export class MaxDistanceError extends Error {
  constructor() {
    super('Distance between user and gym is too far')
  }
}
