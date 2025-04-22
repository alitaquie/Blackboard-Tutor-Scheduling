# BlackBoard 

<img src="Blackboard/assets/full_logo.jpg" alt="Example Image" width="100"> 

# Demo 

[![Demo Video](https://img.youtube.com/vi/ITTPUm1-Wlc/0.jpg)](https://www.youtube.com/watch?v=ITTPUm1-Wlc)

# Node.js
Download the latest LTS (Long Term Support) version of Node.js from [Node.js Official Website](https://nodejs.org/en).

# React-native
With Node.js installed, use your terminal to install the React-native library:

```bash
npm install -g react-native-cli
```

# Expo Go App
Download the Expo Go app on your mobile device for testing. Instructions for Android and iOS installations are available on the [Expo website](https://expo.dev/go).

##### 1. Starting the Simulation
Navigate to the Source Code Directory:

```bash
cd Blackboard
```

##### 2. Install Node.js Dependencies:

```bash
npm install
```
##### 3. Start the App:

```bash
npx expo start
```

After running the command, a QR code will appear in your terminal. Scan this QR code with the Expo Go app on your mobile device.

The app will take a moment to load and will direct you to the login page, where you can log in with an existing account or create a new one.

# Directory Structure
### Features Folder
This folder contains files implementing specific, reusable features across multiple screens such as the navbar, back button, and profile picture, enhancing modularity and code organization.

### Screens Folder
Organizes the UI components specific to different user roles and functionalities:

- Student Specific Screens: ClassReview.js, ClassInfo.js, StudentClass.js
- Teacher Specific Screens: TeacherClass.js, TeacherProfile.js
- Common Screens: DisplayInfo.js, HomeScreen.js, LoginScreen.js, ProfileScreen.js, SignUpScreen.js, SplashScreen.js

### App.js
Manages navigation stacks of all screens.

### Firebase.js
Configures Firebase API by setting up the required features (storage, authentication, database) and providing configuration IDs.

##### Current code quality metric: WTF's/minute: 1
