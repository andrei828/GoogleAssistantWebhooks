class LoggerService {
  log(message) {
    const timestamp = new Date().toISOString();
    this.logs.push({ message, timestamp });
    console.log(`${timestamp}: ${message}`);
  }
}
  
module.exports = LoggerService;