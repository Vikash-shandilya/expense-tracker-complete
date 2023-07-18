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

    const newBtn = document.createElement("button");
    const newBtn2 = document.createElement("button");
    newBtn.textContent = "Show leaderboard";
    newBtn2.textContent = "downloadyoureport";

    newBtn2.style.marginLeft = "10px";

    newBtn.addEventListener("click", showleaderboard);
    newBtn2.addEventListener("click", downloadreport);

    document.getElementById("twobtn").appendChild(newBtn);
    document.getElementById("twobtn").appendChild(newBtn2);

    let result = await axios.get("http://localhost:3000/getpreviousdownloads");
    console.log(result);
    const openButton = document.createElement("button");
    openButton.textContent = "previous downloads";

    const slidingWindow = document.createElement("div");
    slidingWindow.id = "slidingWindow";
    slidingWindow.style.width = "500px";
    slidingWindow.style.height = "650px";
    slidingWindow.style.backgroundColor = "#f0f0f0";
    slidingWindow.style.position = "fixed";
    slidingWindow.style.top = "0";
    slidingWindow.style.right = "-520px";
    slidingWindow.style.transition = "right 0.1s ease-out";

    const windowContent = document.createElement("div");
    windowContent.id = "windowContent";
    windowContent.style.padding = "20px";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";

    openButton.addEventListener("click", () => {
      slidingWindow.classList.toggle("open");
      slidingWindow.style.right = slidingWindow.classList.contains("open")
        ? "0"
        : "-520px";
    });

    for (let j = 0; j < result.data.data.length; j++) {
      let newdiv = document.createElement("div");
      let newli = document.createElement("li");
      newli.textContent = `${result.data.data[j].createdAt}`;
      let button3 = document.createElement("button");
      button3.textContent = "download";
      button3.onclick = () => {
        const createlink = document.createElement("a");
        createlink.href = result.data.data[j].fileurl;
        createlink.download = "expense.txt";
        createlink.click();
        console.log(res);
        alert("Your file is downloaded");
      };
      newdiv.appendChild(newli);
      newdiv.appendChild(button3);

      windowContent.appendChild(newdiv);
      slidingWindow.appendChild(windowContent);
    }

    document.getElementById("twobtn").appendChild(openButton);
    document.getElementById("twobtn").appendChild(slidingWindow);
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

async function downloadreport() {
  let res = await axios.get("http://localhost:3000/download");
  const createlink = document.createElement("a");
  createlink.href = res.data.fileurl;
  createlink.download = "expense.txt";
  createlink.click();
  console.log(res);
  alert("Your file is downloaded");
}

async function choosemonth() {
  const ifpremium = await axios.get("http://localhost:3000/ifpremium");
  console.log(ifpremium.data);
  if (ifpremium.data) {
    const monthname = document.getElementById("month").value;
    console.log(monthname);
    const response = await axios.get(
      `http://localhost:3000/monthlyexpense/${monthname}`
    );
    let week1 = [];
    let week2 = [];
    let week3 = [];
    let week4 = [];
    for (let i = 0; i < response.data.length; i++) {
      let date = response.data[i].createdAt.split("-")[2].slice(0, 2);
      if (date >= 1 && date <= 7) {
        week1.push(response.data[i]);
      } else if (date >= 8 && date <= 15) {
        week2.push(response.data[i]);
      } else if (date >= 16 && date <= 23) {
        week3.push(response.data[i]);
      } else {
        week4.push(response.data[i]);
      }
    }
    const expense1 = week1.reduce((sum, obj) => sum + obj.amount, 0);
    const expense2 = week2.reduce((sum, obj) => sum + obj.amount, 0);
    const expense3 = week3.reduce((sum, obj) => sum + obj.amount, 0);
    const expense4 = week4.reduce((sum, obj) => sum + obj.amount, 0);

    const catexpense1 = week1.reduce((totals, obj) => {
      const category = obj.category;
      const amount = obj.amount;
      if (totals[category]) {
        totals[category] += amount;
      } else {
        totals[category] = amount;
      }
      return totals;
    }, {});
    const catexpense2 = week2.reduce((totals, obj) => {
      const category = obj.category;
      const amount = obj.amount;
      if (totals[category]) {
        totals[category] += amount;
      } else {
        totals[category] = amount;
      }
      return totals;
    }, {});
    const catexpense3 = week3.reduce((totals, obj) => {
      const category = obj.category;
      const amount = obj.amount;
      if (totals[category]) {
        totals[category] += amount;
      } else {
        totals[category] = amount;
      }
      return totals;
    }, {});
    const catexpense4 = week4.reduce((totals, obj) => {
      const category = obj.category;
      const amount = obj.amount;
      if (totals[category]) {
        totals[category] += amount;
      } else {
        totals[category] = amount;
      }
      return totals;
    }, {});
    console.log(expense1, expense2, expense3, expense4);
    console.log(catexpense1, catexpense2, catexpense3, catexpense4);
    const week1st = document.getElementById("1stweek");
    week1st.textContent = expense1;
    const week2st = document.getElementById("2ndweek");
    week2st.textContent = expense2;
    const week3st = document.getElementById("3rdweek");
    week3st.textContent = expense3;
    const week4st = document.getElementById("4thweek");
    week4st.textContent = expense4;

    const cat1 = JSON.stringify(catexpense1);
    const cat2 = JSON.stringify(catexpense2);
    const cat3 = JSON.stringify(catexpense3);
    const cat4 = JSON.stringify(catexpense4);

    const cat1st = document.getElementById("description1");
    cat1st.textContent = cat1;
    const cat2st = document.getElementById("description2");
    cat2st.textContent = cat2;
    const cat3st = document.getElementById("description3");
    cat3st.textContent = cat3;
    const cat4st = document.getElementById("description4");
    cat4st.textContent = cat4;

    const total = expense1 + expense2 + expense3 + expense4;
    const totalst = document.getElementById("total");
    totalst.textContent = total;
  } else {
    alert("You are not a premium user");
  }
}
