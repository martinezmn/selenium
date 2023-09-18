import { By, ThenableWebDriver } from "selenium-webdriver";
import { Mailer } from "./mailer";
import dotenv from "dotenv";
dotenv.config();

export class SearchData {
  constructor(
    private readonly driver: ThenableWebDriver,
    private readonly mailer: Mailer
  ) {}

  async search(): Promise<void> {
    let dateFound = false;
    while (!dateFound) {
      try {
        const currentUrl = await this.driver.getCurrentUrl();
        const currentPage = currentUrl.split("#")[1];

        switch (currentPage) {
          case "services":
            await this.servicesPage();
            break;
          case "datetime":
            dateFound = await this.datetimePage();
            break;
          default:
            await this.initialPage();
            break;
        }
      } catch (error: any) {
        console.error(error.message ?? JSON.stringify(error));
      } finally {
        await this.driver.sleep(5000);
      }
    }
    await this.mailer.sendFound();
  }

  private async initialPage(): Promise<void> {
    await this.driver.get(String(process.env.DRIVER_URL));
    await this.driver.sleep(10000);

    const pElements = await this.driver.findElements(By.css("p"));
    const linkElement = await pElements[5].findElement(By.css("a"));
    await linkElement.click();
  }

  private async servicesPage(): Promise<void> {
    const buttonElements = await this.driver.findElements(
      By.className("clsBktServiceName")
    );

    await buttonElements[3].click();
  }

  private async datetimePage() {
    const slotElements = await this.driver.findElements(
      By.className("clsDivDatetimeSlot")
    );

    console.info(new Date(), slotElements.length, "slots available.");

    if (slotElements.length) {
      return true;
    }

    const backElement = await this.driver.findElement(
      By.className("clsDivSubHeaderBackButton")
    );
    await backElement.click();
    return false;
  }
}
