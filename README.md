This is an example which shows how you can create an app for different locales without _rebuilding_ your whole app for every locale. It even features code completion and IntelliSense for translations in TypeScript.

**Note**: If anyone knows how to easily gain tree shaking for translation, please write an issue. You'll see that our package contains two translations (`foo` and `bar`), but only one is used (`foo`). It would be nice, if the other translation (`bar`) could be removed from the build.

# How to use this?

```
$ npm install
$ npm run -s build && npm run -s serve
```

Now you can visit `http://127.0.0.1:8081/de_DE/` and you should see `'Hallo foo.'` in your browser console.
