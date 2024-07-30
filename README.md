# Frontend App Skillable
## Introduction

This MFE application for Skillable Project offers an extensive range of features and a user-friendly interface for any given course with the Skillable feature enabled.

## Cloning and Startup
### Node setup

It's important to note that this MFE is build with Node v16, so we shall ensure that that's the proper and only version instaled in our workspace.
To do so please execute the following commands in your Ubuntu's terminal
```
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# download and install Node.js (you may need to restart the terminal)
nvm install 16
# verifies the right Node.js version is in the environment
node -v # should print 'v16.20.2'
# verifies the right NPM version is in the environment
npm -v # should print '8.19.4'
```
Once this was done, please excute `nvm ls` it shall show an output like this (please be aware of the version pointed by an arrow)

![image](https://github.com/Pearson-Advance/frontend-app-skillable/assets/74993704/676f6dd9-3305-43ff-82db-2227ca560cf1)

If there's any other prior or further version installed, please remove it with `nvm uninstall vXX.XX.X`

### Project setup
Clone this repo into the `/src` folder of your devstack installation, once it has been cloned, follow the next command:

`cd frontend-app-skillable && npm install`

It would place you onto the repository folder and install de dependencies nedeed for the project to run. With that just execute
`npm start`. There shall be a frontend running in http://localhost:2003/

## Testing
- Jest test: `npm test`
- Lint test: `npm run lint`
