async function forgetpass() {
  const email = document.getElementById("email").value;
  console.log(email);
  myobj = { email };
  let res = await axios.post("http://13.48.71.100:3000/user/forgotpass", myobj);
  console.log(res.data.url);
  localStorage.setItem("token", res.data.token);
}

async function submitpassreset() {
  const token = localStorage.getItem("token");

  console.log(token, "token");
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmPassword").value;
  if (password != confirmpassword) {
    alert("password not match");
  } else {
    console.log(token, password);
    let response = await axios.post(
      `http://13.48.71.100:3000/password/reset/${token}`,
      { password }
    );
    console.log(response);
  }
}
