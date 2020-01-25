const Schnupons = require("./schnupons");

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
    console.warn("Schnupon clipping failure.");
    console.error(err);
    await schnupons.dispatch(err.message);
  } finally {
    schnupons.cleanup();
  }
};
