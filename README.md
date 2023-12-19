# License Download App

This app will download a list of licenses from your Github repo based on a supplied SBOM file

## How to Use It

1. Clone this repository.
2. Under Insights > Dependency Graph on your Github repo, export your project's SBOM file and place it at the root of this repository.
3. Edit line 4 of index.ts to be the name of the exported SBOM file.
4. Open a terminal in this repository and run: `npx tsc index.ts && node index.js`.
