How to run and test app:
- create an github oauth app instructions in: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
- Download or clone repository
- do command: npm run install root folder
- from your oauth app copy clientId to App.vue file in client/src/App.vue
- generate token in oauth token and add it to the server/routes/api.js file
- run npm run dev
- go to http://localhost:5173/
- test by clicking login button and entering your github credentials
  
