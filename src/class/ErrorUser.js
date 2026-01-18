class UserError extends Error {
  /**
   * Represent an error message display to the user.
   * @param {String} message the message you want to display
   */
  constructor(message) {
    super(message);
    this.name = 'UserError';
    this.isUserError = true;
  }
}

module.exports = UserError;
