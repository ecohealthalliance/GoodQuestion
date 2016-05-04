# GoodQuestion
Mobile application for taking trigger based surveys.

### Technologies
GoodQuestion is built using [react-native](https://facebook.github.io/react-native/).  In order to run GoodQuestion you will need to install react-native using the instructions [here](https://facebook.github.io/react-native/docs/getting-started.html#content).

The project also uses [Parse Server](https://github.com/ParsePlatform/parse-server) as the back-end solution. Instructions for installation are available [here](https://github.com/ParsePlatform/parse-server#getting-started) and documentation for development are published [on their site](https://parse.com/docs/js/guide).

### Running
Once react-native has been installed you can run the iOS version of the application by running the following command:
```
react-native run-ios
```
For Android run the following command:
```
react-native run-android
```

To run your local Parse server, use:
```
mongodb-runner start
parse-server --appId testapp --masterKey test
```