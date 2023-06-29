window.addEventListener("DOMContentLoaded", async () => {
  let res = await axios.get("http://localhost:3000/expense");

  for (let i = 0; i < res.data.length; i++) {
    let newdiv = document.createElement("div");
    let newli = document.createElement("li");
    let delete_btn = document.createElement("button");

    delete_btn.onclick = deleted;
    delete_btn.type = "submit";
    delete_btn.textContent = "delete";

    delete_btn.setAttribute("productid", res.data[i].id);

    console.log(res.data);

    newli.textContent = `${res.data[i].amount}-${res.data[i].description}- on ${res.data[i].category}`;

    newli.appendChild(delete_btn);
    newdiv.appendChild(newli);
    document.getElementById("list").appendChild(newdiv);
  }
});

async function addexpense() {
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  myobj = { amount, description, category };

  let res = await axios.post("http://localhost:3000/expense", myobj);
  window.location.reload();
}

async function deleted(e) {
  let id = e.target.getAttribute("productid");
  console.log(id);
  let res = await axios.get(`http://localhost:3000/expenses/deleted/${id}`);
  console.log(res);
  window.location.reload();
}
