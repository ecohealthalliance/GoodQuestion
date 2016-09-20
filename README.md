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

GoodQuestion uses two different settings files to store private information outside of version control. The location and format for each is as follows:

##### a. `ios/Settings.xcconfig`

*Note: this file may have blank keys*

```
//
//  Settings.xcconfig
CODE_PUSH_KEY[config=Staging]=
CODE_PUSH_KEY[config=Release]=
```

##### b. `js/settings.js`

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



