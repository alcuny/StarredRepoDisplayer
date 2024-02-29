<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

const client_ID = "e42429a78f551d96c4a8"
const client_SECRET = "048ee6faaa175b55350b5405bb92edc4359d8328"
const repos = ref([]);

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

const handleButtonClick = () => {
  // Call getUserData function when button is pressed
  getData();
};

onMounted(() => {
  const query = window.location.search
  const params = new URLSearchParams(query)
  const code = params.get('code')
  console.log(code)
  if(code && localStorage.getItem("accessToken") === null){

  axios.post('http://localhost:3000/api/getToken', {
    code: code
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

    
    
      
      <c-login-button @click="login" src="/assets/github-mark-white.svg">Login</c-login-button>
      
      <button @click="handleButtonClick">User Data</button>
      
    
  </header>

  <main>
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
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
