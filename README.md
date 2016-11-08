This is an example which shows how you can create an app for different locales without **rebuilding your whole app for every locale**. It even features code completion and IntelliSense for translations in TypeScript. It has just uses _one_ webpack config. All other localization strategies for webpack I could find use multple configs [like this one in the official repository](https://github.com/webpack/webpack/blob/master/examples/i18n/webpack.config.js#L7).

It essentially translates this:

```
i18n/
  # our translations, e.g. for de_DE and en_US
src/
  # our application code
  # our application styles
  # and everything else like assets
```

To this:

```
dist/
  index-[hash].js
  style-[hash].js
  # and everything else like assets
  de_DE/
    # translations for de_DE with [hash]
    index.html
  en_US/
    # translations for en_US with [hash]
    index.html
```

`dist/de_DE/index.html` loads everything excpept translations for `en_US` and _vice versa_.

**Note**: If anyone knows how to easily add **tree shaking for translations**, please write me. You'll see that our package contains two translations (`foo` and `bar`), but only one is used (`foo`). It would be nice, if the other translation (`bar`) could be removed from the build.

# How to use this?

```
$ npm install
$ npm run -s build && npm run -s serve
```

Now you can visit `http://127.0.0.1:8081/de_DE/` and you should see `'Hallo foo.'` in your browser console.

# Break down

0. All our translations come from an _artificial_ module which I called `@foo/i18n` in this example.
0. It is used and imported in our app [like every other module](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/src/index.ts#L2). Just `import {} from '@foo/i18n';`.
0. But our webpack config [ignores this import completely](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L57), because we want to pass only the translations specific for a given locale to our app.
0. However we want TypeScript [to _know_ this package](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/i18n/index.d.ts), so we get real code completion and documentation. This is espacially useful when our translations can get params (e.g. when we use [intl-messageformat](https://github.com/yahoo/intl-messageformat) or something similar).
0. Now our application code and all our translations need to become [an entry chunk](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L13) for webpack. Our translations actually look [like this](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/i18n/de_DE.js). Note that we need to export our module with its [own module name](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/i18n/de_DE.js#L1) or it will not be picked up correctly by our application. (This will essentially become `window['@foo/i18n']`, which is loaded correctly, because we use [UMD modules](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L19). This was the only way for me to load the translations correctly. If you know a better way, please write me.)
0. Every locale will have its own subdirectory. To place our translations correctly into their own subdirectories, the entry names can become [_paths_](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L15) which are just used in our [`output` config as `[name]`](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L20).
0. A similar strategy is used for every locale specific `index.html` to get [only the chunks we need](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L44). We just use the [`html-webpack-plugin`](https://github.com/ampedandwired/html-webpack-plugin) plugin multiple times. Note that we need to ensure that the translations are loaded [before our application](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L45).
0. We can [pass arbitrary data](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/webpack.config.js#L41) to `html-webpack-plugin`, so we can even [use our locale specific translations at build time](https://github.com/donaldpipowitch/webpack-i18n-example/blob/00a74b9065b7d8f0fa5050d3b57de2c4e61304e8/src/index.html#L69) in our `index.html` template.
