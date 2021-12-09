class ConversationParser {
  getLanguage(conv) {
    const language = conv.user.locale
    if (language.includes("en-"))
      return "en"
    if (language.includes("de-"))
      return "de"
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

  getMatchCodeFromSession(conv, key) {
    for (let obj of conv.session.params.options) {
      if (obj.key == key) {
        return obj.matchCode
      }
    }
    return null
  }

  getOrderByKeyTimestamp(conv, key) {
    for (let obj of conv.session.params.options) {
      if (JSON.stringify({
        _seconds: obj.timestamp._seconds,
        _nanoseconds: obj.timestamp._nanoseconds
      }) === key) {
        return obj
      }
    }
    return null
  }
}

module.exports = ConversationParser