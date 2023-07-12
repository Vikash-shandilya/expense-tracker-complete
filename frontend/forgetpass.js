async function forgetpass() {
  const email = document.getElementById("email").value;
  console.log(email);
  myobj = { email };
  let res = await axios.post("http://localhost:3000/user/forgotpass", myobj);
  console.log(res);
}
