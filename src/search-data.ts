import { By, ThenableWebDriver } from "selenium-webdriver";
import { Mailer } from "./mailer";

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
        }
        await this.driver.sleep(5000);
      } catch (error) {
        console.error(error);
      }
    }
    await this.mailer.sendFound();
  }

  private async servicesPage(): Promise<void> {
    const buttonElements = await this.driver.findElements(
      By.className("clsBktServiceName")
    );

    await buttonElements[2].click();
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
