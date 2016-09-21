# GoodQuestion  [![CircleCI](https://circleci.com/gh/ecohealthalliance/GoodQuestion.svg?style=svg)](https://circleci.com/gh/ecohealthalliance/GoodQuestion)
Mobile application for taking trigger based surveys.

### Technologies

#### Frontend

The GoodQuestion iOS and Android clients are built using [react-native](https://facebook.github.io/react-native/), a cross-platform JavaScript framework for building native mobile apps.

#### Backend

GoodQuestion uses [parse-server](https://github.com/ParsePlatform/parse-server) as the backend solution. The [gq-parse-server]() repository contains a custom parse-server setup for sending emails through Amazon SES and cloud code. See II. Backend Installation below.

### I. Frontend Installation

#### 1) Clone the GoodQuestion repository

From a directory were you store git repos:

``` 
git clone git@github.com:ecohealthalliance/GoodQuestion.git
```

#### 2) Run npm to install dependencies

```
cd GoodQuestion/ && npm install
```

#### 3) Create settings files

GoodQuestion uses three different settings files to store private information outside of version control. The location and format for each is as follows:

##### a. IOS `ios/Settings.xcconfig`

*Note: This file may have blank keys but must be present to compile. The keys are only necessary if you will be using CodePush for publishing releases.*

On iOS, the file `Settings.xcconfig` (its a text file that has the following format) needs added to `ios/` directory.

```
//
//  Settings.xcconfig
CODE_PUSH_KEY[config=Staging]=
CODE_PUSH_KEY[config=Release]=
```

##### b. Android `~/.gradle/gradle.properties`

*Note: This file is optional. The keys are only necessary if you will be using CodePush for publishing releases.*

On Android, the file `gradle.properties` (its a text file that has the following format) needs added to a hidden folder on your home directory `~/.gradle/gradle.properties`.

```
#
# gradle.properties
CODE_PUSH_STAGING_KEY=
CODE_PUSH_PRODUCTION_KEY=
```

##### c. `js/settings.js`

```
const Settings = {
  dev: false,
  networkTimeout: 30000,
  // parse-server
  parse: {
    appId: 'localParse',
    masterKey: 'secret',
    appName: 'LocalParse',
    serverUrl: 'http://127.0.0.1:1337/parse',
  },
  // admin user
  users: [
    {
      user: 'admin@yourdomain.com',
      pass: 'secret',
    },
  ],
  // authentication server
  openam: {
    email: 'admin',
    password: 'password',
    baseUrl: 'https://openam.yourdomain.com',
    authPath: '/openam/json/authenticate?Content-Type=application/json',
    regPath: '/openam/json/users/?_action=create',
    changePasswordPath: '/openam/json/users/${username}?_action=changePassword'
  },
  // geolocation licenses
  licenses: {
    BackgroundGeolocation: {
      bundleId: 'com.yourdomain',
      key: 'yourkey',
    },
  },
  // google cloud messaging (push)
  senderID: '0000000000',
  identifier: 'com.yourdomain',
};
	
module.exports = Settings;
	
```


### II. Backend Installation

See [gq-parse-server]().


### III. Running

#### a) Start the development backend server:

```
cd gq-parse-server/ && npm run dev
```
	
Verify that the Backend is running:
	 
```
curl -X POST \
  -H 'X-Parse-Application-Id: localParse' \
  -H 'X-Parse-Master-Key: secret' \
  -H 'Content-Type: application/json' \
  -d '{"message": "hello"}' \
  http://localhost:1337/parse/functions/echo
```

#### b) Start the client(s)

For iOS client:
	
*Note: this will automatically launch an iOS simulator*
	
```
react-native run-ios
```
	
For Android client:
	
*Note: one will need to manually launch an Android emulator*
	
```
react-native run-android
```

### Tools

We have included a command line tool to help local development with Parse servers. The tool will populate your server with dummy data which can be queried, mutated, or erased.

```node tool-populate/index.js --help```

```
  Usage: index [options]

  Options:

    -h, --help              output usage information
    -i, --init              Create inital role and user classes.
    -d, --demo              Populate local Parse server with demo data.
    -g, --demoGeofence      Populate local Parse server with geofence demo data.
    -r, --reset             Erase local Parse data.
    -p, --publicRead        Sets all surveys, forms, questions as public readable
    -s, --submissions       Creates dummy submissions for each dummy user
    -c, --clearSubmissions  Clears submissions
```

## CodePush
[PR #144](https://github.com/ecohealthalliance/GoodQuestion/pull/144) implemented [react-native-code-push](https://microsoft.github.io/code-push/docs/react-native.html)

> CodePush is a cloud service that enables Cordova and React Native developers to deploy mobile app updates directly to their users’ devices. It works by acting as a central repository that developers can publish certain updates to (e.g. JS, HTML, CSS and image changes), and that apps can query for updates from (using our provided client SDKs). This allows you to have a more deterministic and direct engagement model with your end-users, while addressing bugs and/or adding small features that don’t require you to re-build a binary and/or re-distribute it through any public app stores.

### Install CodePush and register

```
npm install -g code-push-cli
code-push register
```

### Push updates

You'll need to be added as a [collaborator](https://github.com/Microsoft/code-push/tree/master/cli#app-collaboration) to the GoodQuestion-iOS and GoodQuestion-Android Code Push apps. Once this has been completed, you'll get the keys for `ios/Settings.xconfig` and `~/.gradle/gradle.properties`. 
