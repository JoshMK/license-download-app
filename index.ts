const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const data = require("./example.json"); //can export the BSOM from the dependency graph and put it here

//https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository#searching-github-by-license-type
type LicenseType =
  | "AFL-3.0.txt"
  | "Apache-2.0.txt"
  | "Artistic-2.0.txt"
  | "BSL-1.0.txt"
  | "BSD-2-Clause.txt"
  | "BSD-3-Clause.txt"
  | "BSD-3-Clause-Clear.txt"
  | "BSD-4-Clause.txt"
  | "0BSD.txt"
  | "CC.txt"
  | "CC0-1.0.txt"
  | "CC-BY-4.0.txt"
  | "CC-BY-SA-4.0.txt"
  | "WTFPL.txt"
  | "ECL-2.0.txt"
  | "EPL-1.0.txt"
  | "EPL-2.0.txt"
  | "EUPL-1.1.txt"
  | "AGPL-3.0.txt"
  | "GPL.txt"
  | "GPL-2.0.txt"
  | "GPL-3.0.txt"
  | "LGPL.txt"
  | "LGPL-2.1.txt"
  | "LGPL-3.0.txt"
  | "ISC.txt"
  | "LPPL-1.3c.txt"
  | "MS-PL.txt"
  | "MIT.txt"
  | "MPL-2.0.txt"
  | "OSL-3.0.txt"
  | "PostgreSQL.txt"
  | "OFL-1.1.txt"
  | "NCSA.txt"
  | "Unlicense.txt"
  | "Zlib.txt";

function getLicenseList(): string[] | string {
  let licenseList: Array<string> = [];
  for (const dependency of data.packages) {
    if (dependency.licenseConcluded) {
      licenseList = [...licenseList, dependency.licenseConcluded];
    }
  }
  if (licenseList.length === 0) {
    return "No licenses found.";
  }

  return Array.from(new Set(licenseList.sort((a, b) => (a > b ? 1 : -1))));
}

function getLicenseListDownloads(): Array<LicenseType> {
  const licenses = getLicenseList();
  let uniqueLicenseNames: Array<LicenseType> = [];
  //replace all parenthesis + AND/OR
  const filteredLicenses = (licenses as string[]).map((license) =>
    Array.from(
      new Set(
        license
          .replace("(", "")
          .replace(")", "")
          .split(" ")
          .filter((license) => license !== "AND" && license !== "OR")
      )
    )
  );
  //add unique entries with extension to list
  filteredLicenses.forEach((licenses) => {
    for (let i = 0; i < licenses.length; i++) {
      if (!uniqueLicenseNames.includes(`${licenses[i]}.txt` as LicenseType)) {
        uniqueLicenseNames = [
          ...uniqueLicenseNames,
          `${licenses[i]}.txt` as LicenseType,
        ];
      }
    }
  });
  return uniqueLicenseNames.sort((a, b) => (a > b ? 1 : -1));
}

const downloadLicenseFiles = async () => {
  const licenses = getLicenseListDownloads();
  if (!fs.existsSync(`${__dirname}/licenses`)) {
    fs.mkdirSync(`${__dirname}/licenses`);
  }
  try {
    for (let i = 0; i < licenses.length; i++) {
      const licenseName = await fetch(
        `https://raw.githubusercontent.com/spdx/license-list-data/main/text/${licenses[i]}`
      );
      const text = await licenseName.text();
      await fsPromises.writeFile(
        path.join(`${__dirname}/licenses`, licenses[i]),
        text
      );
      console.log(
        `license for ${licenses[i]} (${i} of ${licenses.length}) written.`
      );
    }
  } catch (err) {
    console.error(err);
  }
};

downloadLicenseFiles();
