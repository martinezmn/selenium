import { Browser, Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { SearchData } from "./search-data";
import { Mailer } from "./mailer";

const chromeOptions = new Options();
chromeOptions.addArguments("--headless");
chromeOptions.addArguments("--no-sandbox");
chromeOptions.addArguments("--disable-dev-shm-usage");

const driver = new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(chromeOptions)
  .build();

(async () => {
  try {
    const mailer = new Mailer();
    const searchData = new SearchData(driver, mailer);
    await searchData.search();

    await driver.sleep(5000);
    await driver.quit();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
