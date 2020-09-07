# form-vue

The first page is the login page where in I have used Firebase authentication and it's google provider.
After you have logged in you will be presented with the dashboard.
The Dashboard consists of a progress bar which indicates the progress of the input field you have filled.
Then there is a form and once you have saved the form data after filling each field then you will be shown all your saved form data on the right side of the form.
The Vuexfire helps to sync the saved form data and show it in realtime.
The Vuefire package helps to sync the form submission in real time. 
To save the cost of the api call I have used debounce and delayed the api call to firestore for 2500 ms
If you leave the form half filled and logout then your form data is preserved and will resume when you login.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
