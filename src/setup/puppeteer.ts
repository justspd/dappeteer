import Stealth from "puppeteer-extra-plugin-stealth";
import pupetteer from "puppeteer-extra";
import Block from "puppeteer-extra-plugin-block-resources";

import { DappeteerBrowser } from "../browser";
import { DappeteerLaunchOptions } from "../types";

export async function launchPuppeteer(
  metamaskPath: string,
  userDataDir: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  pupetteer.use(Stealth());
  pupetteer.use(Block({ blockedTypes: new Set(["image"]) }));
  const pBrowser = await pupetteer.launch({
    ...(options.puppeteerOptions ?? {}),
    headless: options.headless,
    userDataDir,
    args: [
      "--accept-lang=en",
      "--window-size=1920,1080",
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      ...(options.puppeteerOptions?.args || []),
      ...(options.headless ? ["--headless=new"] : []),
    ],
  });
  const { DPuppeteerBrowser } = await import("../puppeteer");
  return new DPuppeteerBrowser(pBrowser, userDataDir, options.metaMaskFlask);
}
