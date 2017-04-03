# Likeastore Browser Extension

Augments Google search results with search from your likes.

## Supported Browsers

* [Chrome](https://chrome.google.com/webstore/detail/likeastore/einhadilfmpdfmmjnnppomcccmlohjad)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/likeastore-social-bookmarking-/)
* [Safari](http://addons.likeastore.com/files/safari/likeastore.safariextz)

## Development

All changes have to be applied into `/js`, `/css`, `/img` folders. To build the sources into corresponding packages run,

```bash
$ gulp
```

The `/build` folder is created. It's recommened to use Chome for development, since it's very easy to create extension from folder with sources.

## Distribution

Once the changes are in-place and ready for distribution:

1. Update all `/vendor` package file with new version (`manifest.json`, `package.json`, `Settings.plist`).
2. Update `/vendor` browser file if necessary.
3. Run `dist`.

```bash
$ gulp dist
```

The `/dist` folder will contain ready to dist packages (except of Safari, that require manual build).

# License

MIT info@likeastore.com
