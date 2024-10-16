export class TimeExpirationValidateCheckIn extends Error {
  constructor() {
    super(
      'The check-in can only be validated within 30 minutes of its creation',
    )
  }
}
