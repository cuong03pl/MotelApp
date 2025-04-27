import axios from "axios";

const STK = "0867086321";
const TYPE = "compact2";
const ADDINFO = `Thanh toan coc tro ${
  Math.floor(Math.random() * (10000000 - 1 + 1)) + 1
}`;

const ACCOUNTNAME = "HOANG KIM CUONG";
const BANK = "MB";

var AMOUNT = 0;
export const paymentConfig = (amount) => {
  AMOUNT = amount;
  return `https://img.vietqr.io/image/${BANK}-${STK}-${TYPE}.png
              ?amount=${amount}&addInfo='${ADDINFO}'&accountName=${ACCOUNTNAME}`;
};
export const checkPayment = async () => {
  try {
    const response = await axios.get(
      "https://script.google.com/macros/s/AKfycbwD1OGE8C50pUY6BzmGVw-r46ncJvRqGGgTJjQBm3nfTOZW2JNfXEHZSlOP0r79ILRbtQ/exec"
    );
    const data = response.data.data[response.data.data.length - 1];

    return AMOUNT === data["Giá trị"] && data["Mô tả"].includes(ADDINFO);
  } catch (error) {
    console.error("Fetch error details:", error);
    return false;
  }
};
