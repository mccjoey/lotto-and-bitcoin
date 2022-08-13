const inputValue = document.querySelector("#date-time-input");
const submitButton = document.querySelector("#submitButton");
const drawList = document.querySelector(".draw-list .content");

function getNextLottoDraw(date = new Date()) {
  let nextDraw = new Date();
  const dateWeekDay = date.getDay();
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

  //   console.log("weekday:", dateWeekDay);
  //   console.log("hour:", dateHour);
  //   console.log("nextDrawDate:", nextDraw);

  return nextDraw;
}

function handleSubmitButton(action) {
  if (action === "loading") {
    submitButton.disabled = true;
    submitButton.innerHTML = "Loading...";
  }

  if (action === "reset") {
    submitButton.disabled = false;
    submitButton.innerHTML = "Submit";
    inputValue.value = null;
  }
}

async function handleGetBitcoinAmount(date) {
  const formatedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  try {
    const bitcoinPriceByDate = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formatedDate}`
    )
      .then((res) => res.json())
      .then((data) => data?.market_data?.current_price?.eur);

    const currentBitcoinPrice = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin`
    )
      .then((res) => res.json())
      .then((data) => data?.market_data?.current_price?.eur);

    const bitcoinValue = 100 / bitcoinPriceByDate;

    const bitcoinValueToday = bitcoinValue * currentBitcoinPrice;

    if (bitcoinValueToday !== NaN && bitcoinPriceByDate !== undefined) {
      return bitcoinValueToday;
    }
    console.log(bitcoinPriceByDate);
    console.log(currentBitcoinPrice);
    console.log(bitcoinValueToday);
  } catch (error) {
    console.log(error);
  }
}

function createDrawListItem(date, bitcoinValue) {
  const drawDateString = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes() + "0"}`;

  const bitcoinValueString = `€${bitcoinValue}`;
  //create a div with class draw-list-item
  //create a div iside drawlistitem with class draw-date
  //create a div iside drawlistitem with class draw-value
}

function addDrawListItem() {}

submitButton.addEventListener("click", async () => {
  if (inputValue.value) {
    //Start submit actionå
    // handleSubmitButton("loading")

    //const drawDateString = drawDate.toLocaleDateString("en-IE");
    const drawDate = getNextLottoDraw(new Date(inputValue.value));
    const currentBitcoinvalue = await handleGetBitcoinAmount(drawDate);
    createDrawListItem(drawDate, currentBitcoinvalue);

    // Reset Button
    // handleSubmitButton("reset")
  }
});
