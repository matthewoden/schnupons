const Schnupons = require("./schnupons");
const logger = require("./logger");

module.exports = async options => {
  const schnupons = new Schnupons({
    timeout: options.timeout,
    username: options.username,
    password: options.password,
    iftttKey: options.iftttKey,
    iftttEvent: options.iftttEvent
  });

  try {
    await schnupons.init();
    await schnupons.login();
    await schnupons.clipCoupons();
  } catch (err) {
    logger.warn("Schnupon clipping failure.");
    logger.error(err);
    await schnupons.dispatch(err.message);
  } finally {
    schnupons.cleanup();
  }
};
