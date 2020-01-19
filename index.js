const Schnupons = require("./schnupons");

module.exports = async (username, password) => {
  const schnupons = new Schnupons();
  try {
    await schnupons.init();
    await schnupons.login(
      username || process.env.SCHNUCKS_USER,
      password || process.env.SCHNUCKS_PASSWORD
    );
    await schnupons.clipCoupons();
  } catch (err) {
    console.warn("Schnupon clipping failure.");
    console.error(err);
  } finally {
    schnupons.cleanup();
  }
};
