class LoggerService {
  info(message) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${message}`);
  }
}
  
module.exports = LoggerService;