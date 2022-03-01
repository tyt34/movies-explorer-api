class RepeatEmail extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = 'Данный email уже зарегистрирован!';
    this.name = 'RepeatEmail';
    this.error = true
    this.ok = 'bad'
  }
}

module.exports = RepeatEmail;
