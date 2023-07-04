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
      await axios.post("http://localhost:3000/updateorder", {
        order_id: orderdetails.id,
        payment_id: response.razorpay_payment_id,
      });
      console.log("now its time to handle");
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
