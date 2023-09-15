import { Browser, Builder, By } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { SearchData } from "./search-data";
import { Mailer } from "./mailer";
import dotenv from "dotenv";
dotenv.config();

const chromeOptions = new Options();
chromeOptions.addArguments("--headless");

const driver = new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(chromeOptions)
  .build();

(async () => {
  try {
    await driver.get(String(process.env.DRIVER_URL));
    await driver.sleep(2000);

    const pElements = await driver.findElements(By.css("p"));
    const linkElement = await pElements[5].findElement(By.css("a"));
    await linkElement.click();
    await driver.sleep(5000);

    const mailer = new Mailer();
    const searchData = new SearchData(driver, mailer);
    await searchData.search();

    await driver.sleep(5000);
    await driver.quit();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
