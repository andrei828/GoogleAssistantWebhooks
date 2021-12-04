class ConversationParser {
  getLanguage(conv) {
    return "en"
  }

  getClientId(conv) {
    return "lab1"
  }

  getUnitOfMeasurementFromSession(conv, key) {
    for (let obj of conv.session.params.options) {
      if (obj.key == key) {
        return obj.unit
      }
    }
    return null
  }
}

module.exports = ConversationParser