window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signp-button').addEventListener('submit', (event) => {
      event.preventDefault();
      submitform();
    });
  });
  







  async function submitform() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("phone_number").value;
    const password = document.getElementById("password").value;
    myobj = {
      name: name,
      email: email,
      phone_number: phone_number,
      password: password,
    };
    let res = await axios.post("http://13.48.71.100:3000/user/signup", myobj);
  
    if (res.status === 200) {
      window.location.href = "login.html";
    }
    console.log(res.status);
  }