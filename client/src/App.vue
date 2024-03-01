<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

const client_ID = ""

const repos = ref([]);
const isLoggedIn = ref(false); // Initially, the user is not logged in

function login(){
  window.location.assign('https://github.com/login/oauth/authorize?client_id='+client_ID)
}


function getData() {
  const authToken = localStorage.getItem("accessToken");

  axios.get('http://localhost:3000/api/getStarredRepos', {
    // Config object with Authorization header
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(response => {
    console.log(response.data);
    repos.value = response.data
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
  });
  
}

onMounted(() => {
  const authToken = localStorage.getItem("accessToken");
  if (authToken) {
    isLoggedIn.value = true; // If access token exists, the user is logged in
    getData();
  } else {
    console.log('Access token not found in localStorage. Component will not mount.');
  }
});

onMounted(() => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const code = params.get('code')
  console.log(code)
  console.log(isLoggedIn)
  if(code && localStorage.getItem("accessToken") === null){

  axios.post('http://localhost:3000/api/getToken', {
    code: code,
    client_id: client_ID
  }, {
    // Config object
    headers: {
      'Content-Type': 'application/json', 
    }
  })
  .then(response => {
    const tokenParams = new URLSearchParams(response.data);
    const accessToken = tokenParams.get('access_token');
    
    console.log(accessToken); // Output the access token
    if(accessToken){
      localStorage.setItem("accessToken", accessToken);
    }
    
    
  })
  .catch(error => {
    console.error('Error fetching access token:', error);
  });

  }
});


</script>

<template>
  <header>

    
    
      
      <!-- Conditionally render the login button -->
    <c-login-button @click="login" src="/assets/github-mark-white.svg">Login</c-login-button>
      
    
      
    
  </header>

  <main style="overflow: auto;">
  
    <c-table responsive>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>URL</th>
          <th>License</th>
          <th>Topics</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="repo in repos" :key="repo.id">
          <td>{{ repo.name }}</td>
          <td>{{ repo.description }}</td>
          <td><a :href="repo.url" target="_blank">{{ repo.url }}</a></td>
          <td>{{ repo.license ? repo.license.name : 'N/A' }}</td>
          <td>{{ repo.topics.join(', ') }}</td>
        </tr>
      </tbody>
    </table>
    </c-table>
  
  </main>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Ensure the header spans the entire width */
  background-color: #ffffff; /* Example background color */
  z-index: 1000; /* Ensure the header is above other content */
}



/*c-table {

}*/




</style>
