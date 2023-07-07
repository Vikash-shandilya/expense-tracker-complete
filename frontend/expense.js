window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //default axios header
  let res = await axios.get("http://localhost:3000/expense");
  console.log(res);

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
  let check = await axios.get("http://localhost:3000/ifpremium");
  if (check.data) {
    let button = document.getElementById("premiumuser");
    const newText = document.createTextNode("You are a premium user.");
    button.parentNode.replaceChild(newText, button);

    const newBtn = document.createElement("button"); // Corrected element creation
    newBtn.textContent = "Show leaderboard";
    newBtn.addEventListener("click", showleaderboard); // Corrected event listener assignment
    document.getElementById("twobtn").appendChild(newBtn);
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
  window.location.reload();
}

//premium buy code

async function premium() {
  let res = await axios.get("http://localhost:3000/get_order_details");
  let orderdetails = res.data.response;
  console.log(orderdetails);
  let options = {
    key: res.data.key_id,
    amount: orderdetails.amount,
    currency: orderdetails.currency,
    name: "testing",
    description: "Test Payment",
    order_id: orderdetails.id,
    handler: async (response) => {
      let res = await axios.post("http://localhost:3000/updateorder", {
        order_id: orderdetails.id,
        payment_id: response.razorpay_payment_id,
      });
      if (res.data.payment) {
        window.location.reload();
        // let button = document.getElementById("premiumuser");
        // const newText = document.createTextNode("you are a premium user ");
        // button.parentNode.replaceChild(newText, button);
      }
    },
  };
  let rzp = new Razorpay(options);
  rzp.open();

  rzp.on("payment.failed", async function (response) {
    const order_id = response.error.metadata.order_id;
    const payment_id = response.error.metadata.payment_id;
    console.log(order_id, payment_id);
    await axios.post("http://localhost:3000/paymentfailed", {
      order_id: order_id,
      payment_id: payment_id,
    });
  });
}

async function showleaderboard() {
  let res = await axios.get("http://localhost:3000/showleaderboard");
  console.log(res);
  console.log(res.data.length);
  for (let i = 0; i < res.data.length; i++) {
    let newdiv = document.createElement("div");
    let newli = document.createElement("li");
    newli.textContent = `${res.data[i].name}- total expense=${res.data[i].total_expenses}`;

    newdiv.appendChild(newli);
    document.getElementById("list").appendChild(newdiv);
  }
}
