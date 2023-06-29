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
  let res = await axios.post("http://localhost:3000/user/signup", myobj);
  let newdiv = document.createElement("div");
  let newli = document.createElement("li");
  newli.textContent = `${res.data.res}`;
  newdiv.appendChild(newli);
  document.getElementById("user").appendChild(newdiv);

  console.log(res);
}

async function submitlogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  myobj = {
    email,
    password,
  };

  let res = await axios.post("http://localhost:3000/user/login", myobj);
  alert(res.data);
  console.log(res);
}
