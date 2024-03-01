
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { mdiLogin, mdiLogout } from '@mdi/js';

// add your client id here:
const client_ID = "07fd82e729809b72583d"


const repos = ref([]);
const isLoggedIn = ref(false); // Initially, the user is not logged in

// source on window.location.assign
// https://www.youtube.com/watch?v=rRn2EisxPl4&t=882s&ab_channel=CooperCodes

function login() {
  window.location.assign('https://github.com/login/oauth/authorize?client_id=' + client_ID);
  // location.reload();
}

function logout() {
  localStorage.removeItem('accessToken');
  isLoggedIn.value = false;
  location.reload();
}

// function that api call for fetching starred repository information 
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
      repos.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });

}

onMounted(() => {
  const authToken = localStorage.getItem("accessToken");
  if (authToken) {
    getData();
    isLoggedIn.value = true; // If access token exists, the user is logged in
  } else {
    console.log('Access token not found in localStorage. Component will not mount.');
  }
});


onMounted(() => {
  // checking whether code exists
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const code = params.get('code');
  
  if (code && localStorage.getItem("accessToken") === null) {

    axios.post('http://localhost:3000/api/getToken', {
      code: code,
      client_id: client_ID
    }, {
      
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        const tokenParams = new URLSearchParams(response.data);
        const accessToken = tokenParams.get('access_token');

        // if token exists then it is set to local storage
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
      });
  }
});


</script>

<template style="display: flex; flex-direction: column; align-items: center;">
  <header>
    <!-- Conditionally render the login and logout button -->
    
    <c-button v-if="!isLoggedIn" @click="login">
      <c-icon :path="mdiLogin" />
      Login
    </c-button>
    <c-button v-if="isLoggedIn" @click="logout">
      <c-icon :path="mdiLogout" />
      Logout
    </c-button>
  </header>

  <main>
    <div>Starred Repos: {{ repos.length }}</div>
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
  width: 100%;
  padding: 20px;
  z-index: 1000;
}
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}


main {
  background-color: #ffffff;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  width: 90vw;
  height: 70vh;
}

c-table {
  width: 100%;
}

</style>