# Repository instructions

- Use English for all source code, identifiers, comments, user-facing strings, documentation, release notes and commit messages.
- The sources are TypeScript under `src/`. The bundle `dist/ha_alarmo-card-feature.js` is built with `npm run build` and committed: what a release publishes is that file, never a bundle built on a runner. Commit the bundle in the same commit as the sources that produced it.
- `filename` in `hacs.json` is the bundle's name without its folder. It is what HACS installs, what the GitHub release carries as its downloadable file, and what `scripts/sync-github.sh` looks for beside `hacs.json`, under `themes/` or under `dist/`.
- Run `node scripts/check-release.mjs` before committing. It reads the bundle as JavaScript, compares the last commit that touched `src/` with the last one that touched the bundle, and wants the Marketplace badge in `README.md` to point at the published repository.
- `tsconfig.json`, `rollup.config.mjs`, `eslint.config.mjs` and `.prettierrc` are still what makes the build run. Until the sources are restructured away from them they stay out of the published copy rather than out of this repository.

## Where this card lives

- The repository is developed on `https://git.itup.ch/mme/ha_alarmo-card-feature`. `https://github.com/psym88/ha_alarmo-card-feature` is the published copy HACS reads.
- Publishing is a release on Forgejo: `.forgejo/workflows/sync-github.yml` pushes the branch, every tag, the release and `dist/ha_alarmo-card-feature.js` as that release's downloadable file to GitHub. A manual run of the same workflow without a tag only syncs branch and tags.
- GitHub gets only the file Home Assistant installs and the page a visitor reads: the branch and every new tag are published from the include list `PUBLISH_INCLUDE` in the workflow, `hacs.json README.md LICENSE images`, plus the file `hacs.json` names, which here is the bundle in `dist/`. `src/`, the build inputs, `scripts/` and the package manager files are not on that list and so are not published; a new file is not either until it is named there. The branch tip on GitHub is a commit of its own with the commit here as its parent, so its sha is not the sha here, and that is the design rather than a mistake. Older tags keep whatever they were published with: they never move.
- Never commit to the GitHub repository, and never move or delete a tag or a release asset that is already on GitHub: HACS installs from them, and the download count hangs off the asset, so replacing it starts that count at zero.
- Versions are `v0.1.5` style and a published tag never moves: a new version is a new tag, and the version in `package.json` moves with it.
