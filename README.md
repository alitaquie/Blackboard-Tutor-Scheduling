# Node.js 
First download the latest LTS (Long Term Support) version of Node.js at https://nodejs.org/en

# React-native 
Once you have Node.js downloaded, install the react-native library in the terminal.

# Expo Go App
You’ll have to now download the Expo Go app on your mobile device. Instructions for installing on Android and iOS are available here: https://expo.dev/go

# Starting the Simulation

Navigate into the Source code folder

```
cd Blackboard
```

Updates/Install any node js dependencies.

```
npm install
```

Start the App

```
npx expo start
```

In the terminal, you’ll find a QR code that you can scan on your phone:


Once you scan that QR code, it will open the Expo Go app. You’ll have to wait a little while before the app loads up. 

You’ll be loaded into the login page where you can login with an existing account or make a new account. 

# Features Folder
Includes files that implement specific features that are typically re-used across multiple screens. Examples include the navbar, back button, and profile picture. Good for modularity of file and code organization.

# Screen Folder

Student Specific Screens: ClassReview.js, ClassInfo.js, StudentClass.js

Teacher Specific Screens: TeacherClass.js, TeacherProfile.js

Common Screens: DisplayInfo.js, HomeScreen.js, LoginScreen.js, ProfileScreen.js, SignUpScreen.js 

# App.js
Stacks of all the screens

# Firebase.js
Configure the Firebase API by providing the configuration ID’s, then setting up the features we want (storage, auth, db).

# WTF’s/minute: 2 (our code is mostly good)
