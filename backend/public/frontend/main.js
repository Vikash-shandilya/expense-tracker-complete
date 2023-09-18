window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    submitlogin();
  });
});




async function submitlogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  myobj = {
    email,
    password,
  };

  let res = await axios.post("http://13.48.71.100:3000/user/login", myobj);

  if (res.data.islogin) {
    localStorage.setItem("token", res.data.token);
    window.location.href = "expense.html";
  }
  if (res.data.ispremium) {
    console.log(res.data.ispremium);
    let button = document.getElementById("premiumuser");
    const newText = document.createTextNode("you are a premium user ");
    button.parentNode.replaceChild(newText, button);
  }

  console.log(res);
}

async function openform() {
  window.location.href = "forgotpass.html";
}




