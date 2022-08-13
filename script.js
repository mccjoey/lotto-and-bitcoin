const inputValue = document.querySelector("#date-time-input");
const submitButton = document.querySelector("#submitButton");
const drawList = document.querySelector(".draw-list .content");
const asideContainer = document.querySelector("aside");

submitButton.addEventListener("click", async () => {
  if (inputValue.value) {
    handleLoadingRequest("loading");

    const drawDate = getNextLottoDraw(new Date(inputValue?.value));

    if (drawDate === "error") {
      showModal();
      handleLoadingRequest("reset");
      return;
    }

    const currentBitcoinvalue = await handleGetBitcoinAmount(drawDate);

    if (!currentBitcoinvalue) {
      addNewDrawListItem(drawDate, 0);
      handleLoadingRequest("reset");
      return;
    }

    addNewDrawListItem(drawDate, currentBitcoinvalue);
    handleLoadingRequest("reset");
  }
});

function getNextLottoDraw(date = new Date()) {
  let nextDraw = new Date();
  const dateWeekDay = date.getDay();

  // Validate years
  if (dateWeekDay instanceof Date === false && isNaN(dateWeekDay)) {
    return (nextDraw = "error");
  }

  const dateHour = date.getHours();
  const wednesdayCondition1 = dateWeekDay <= 2; // till Tuesday
  const wednesdayCondition2 = dateWeekDay === 3 && dateHour <= 19; // wednesday, validating hour
  const saturdayCondition1 = dateWeekDay === 3 && dateHour >= 20; // rest of wednesday date
  const saturdayCondition2 = dateWeekDay === 4 || dateWeekDay === 5; // thursday friday
  const saturdayCondition3 = dateWeekDay === 6 && dateHour <= 19; // saturday, validating hour

  function getDraw(weekday) {
    const newDrawDate = new Date(
      date.setDate(date.getDate() + ((7 - date.getDay() + weekday) % 7))
    );
    newDrawDate.setHours(20, 0, 0);
    return newDrawDate;
  }

  if (wednesdayCondition1) {
    nextDraw = getDraw(3);
  } else if (wednesdayCondition2) {
    nextDraw = getDraw(3);
  } else if (saturdayCondition1) {
    nextDraw = getDraw(6);
  } else if (saturdayCondition2) {
    nextDraw = getDraw(6);
  } else if (saturdayCondition3) {
    nextDraw = getDraw(6);
  } else {
    nextDraw = getDraw(3);
  }

  return nextDraw;
}

async function handleGetBitcoinAmount(date) {
  const formatedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  const currentBitcoinPrice = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin`
  )
    .then((res) => res.json())
    .then((data) => data?.market_data?.current_price?.eur);

  const bitcoinPriceByDate = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formatedDate}`
  )
    .then((res) => res.json())
    .then((data) => data?.market_data?.current_price?.eur);

  const bitcoinValue = 100 / bitcoinPriceByDate;
  const clientBitcoinValueToday = bitcoinValue * currentBitcoinPrice;
  return clientBitcoinValueToday;
}

function addNewDrawListItem(date, bitcoinValue) {
  const drawDateString = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes() + "0"}`;

  const bitcoinValueString =
    bitcoinValue > 0 ? `€${bitcoinValue.toFixed(2)}` : "Not available";

  const item = `
  <div class="draw-list-item">
    <div class="draw-date">${drawDateString}</div>
    <div class="draw-value">${bitcoinValueString}</div>
  </div>`;

  drawList.insertAdjacentHTML("afterbegin", item);

  // Only mobile
  if (window.innerWidth <= 780) {
    asideContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function handleLoadingRequest(action) {
  const loadingText = `
  <div class="animated-loading">
    <span>L</span>
    <span>o</span>
    <span>a</span>
    <span>d</span>
    <span>i</span>
    <span>n</span>
    <span>g</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>`;

  if (action === "loading") {
    submitButton.disabled = true;
    submitButton.innerHTML = null;
    submitButton.insertAdjacentHTML("afterbegin", loadingText);
  }

  if (action === "reset") {
    submitButton.disabled = false;
    submitButton.innerHTML = "Submit";
    inputValue.value = null;
  }
}

function showModal() {
  const modal = `
  <div class="modal">
    <div class="content">
      <h1>Invalid date! Please provide a valid date.</h1>
      <button class="close-modal">Ok</button>
    </div> 
  </div>`;

  document.body.insertAdjacentHTML("afterbegin", modal);

  document.querySelector(".close-modal")?.addEventListener("click", () => {
    document.querySelector(".modal").remove();
  });
}

// //create a div with class draw-list-item
// const newDrawItem = document.createElement("div");
// newDrawItem.className = "draw-list-item";

// //create a div iside drawlistitem with class draw-date
// const newDrawDateItem = document.createElement("div");
// newDrawDateItem.className = "draw-date";

// //create a div iside drawlistitem with class draw-value
// const newDrawValueItem = document.createElement("div");
// newDrawValueItem.className = "draw-value";

// newDrawItem.appendChild(newDrawDateItem);
// newDrawItem.appendChild(newDrawValueItem);

// console.log(newDrawItem);
