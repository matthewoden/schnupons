const wait = require("waait");
const puppeteer = require("puppeteer");

const COUPONS_URL = "https://nourish.schnucks.com/app/coupons/home";
const LOGIN_URL = "https://nourish.schnucks.com/app/sso/login";
const COUPON_CLIP_URL =
  "https://nourish.schnucks.com/app/coupons/api/users/authenticated/clipped";

class Schnupons {
  constructor(options = {}) {
    const defaultOptions = {
      headless: true,
      // human-like imperfection
      viewport: { width: 1507, height: 876 },
      // recent-ish version of chrome.
      // TODO: Figure out a good way to have this update without pull/redeployment.
      useragent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
    };

    this.options = {
      ...defaultOptions,
      ...options
    };
  }
  async init() {
    this.browser = await puppeteer.launch({ headless: this.options.headless });
    this.page = await this.browser.newPage();
    await this.page.setViewport(this.options.viewport);
    await this.page.setUserAgent(this.options.useragent);

    return this;
  }

  async login(username, password) {
    console.log("Logging in.");
    await this.page.goto(LOGIN_URL, { waitUntil: "networkidle2" });
    await this.page.waitForSelector("form.login-form");

    await this.page.type('input[type="message"]', username);
    await this.page.type('input[type="password"]', password);
    await this.page.click(".login-form .btn");

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Login successful.");
    return this;
  }

  async clipCoupons() {
    return this._toggleCoupons(true);
  }

  // for testing/resetting state.
  // TODO: figure out the best way to test puppeteer?
  async unclipCoupons() {
    return this._toggleCoupons(false);
  }

  async cleanup() {
    await this.browser.close();
    return this;
  }

  async _toggleCoupons(shouldClip) {
    const action = shouldClip
      ? { className: ".clipit", actionName: "Clipping" }
      : { className: ".unclipit", actionName: "Unclipping" };

    console.log(`${action.actionName} coupons.`);

    await this.page.goto(COUPONS_URL, { waitUntil: "networkidle2" });
    await this.page.waitForSelector(action.className);

    const couponIds = await this.page.$$eval(action.className, coupons =>
      coupons.map(c => c.getAttribute("id"))
    );

    // Attempting, because the buttons are always there, just not always active.
    // Not worth debugging schnuck's toggle states.
    console.log(`Attempting to click on ${couponIds.length} coupons.`);

    const missedClicks = await couponIds.reduce(async (previous, id) => {
      const missed = await previous;
      try {
        await this.page.click(`#${id} button`);
        if (shouldClip) {
          await this.page.waitForResponse(COUPON_CLIP_URL);
        }
      } catch (err) {
        missed.push(id);
      }
      return missed;
    }, []);

    console.log(
      `${action.actionName} complete. ${missedClicks.length} coupons skipped.`
    );

    return this;
  }
}

module.exports = Schnupons;
