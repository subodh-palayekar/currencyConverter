import axios from "axios";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [currencyData, setCurrencyData] = useState({
    currencyOne: "",
    amountOne: "",
    currencyTwo: "",
    finalAmount: "",
    exRate: "",
  });

  const [currencyOption, setCurrencyOption] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const options1 = {
    method: "GET",
    url: "https://currency-exchange.p.rapidapi.com/listquotes",
    headers: {
      "X-RapidAPI-Key": "32c2e1b8aamshd4330ec547cbcfbp1235b8jsncb35caff129c",
      "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
    },
  };

  const fetchCurrencyOption = async () => {
    try {
      const resp = await axios.request(options1);
      setCurrencyOption(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    console.log(currencyData);
    fetchCurrencyOption();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrencyData({ ...currencyData, [name]: value });
    setIsReady(false);
  };

  const handleSubmit = async () => {
    if (
      currencyData.amountOne &&
      currencyData.currencyOne &&
      currencyData.currencyTwo
    ) {
      const options = {
        method: "GET",
        url: "https://currency-exchange.p.rapidapi.com/exchange",
        params: {
          from: currencyData.currencyOne,
          to: currencyData.currencyTwo,
          q: currencyData.amountOne,
        },
        headers: {
          "X-RapidAPI-Key":
            "32c2e1b8aamshd4330ec547cbcfbp1235b8jsncb35caff129c",
          "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
        },
      };
      const resp = await axios.request(options);

      console.log(resp);
      const num = currencyData.amountOne * resp.data;
      const fAmount = num.toFixed(4);
      setCurrencyData((prevCurrencyData) => ({
        ...prevCurrencyData,
        "finalAmount": fAmount,
        "exRate": resp.data,
      }));

      console.log(currencyData);

      setIsReady(true);
      try {
         
          const response = await axios.post(
            "http://3.108.120.244:8080/upload",
            currencyData
          );
          console.log("Response from server:", response.data);
        
      } catch (error) {
        console.error("Error during POST request:", error);
      }
    }
    console.log(isReady);
  };

  return (
    <div className="home-container">
      <div className="top-container">
        <input
          type="number"
          name="amountOne"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <select
          name="currencyOne"
          onChange={(e) => {
            handleChange(e);
          }}
        >
          {currencyOption.map((currency) => {
            return (
              <option key={currency} value={currency}>
                {currency}
              </option>
            );
          })}
        </select>
        <span>To</span>
        <select
          name="currencyTwo"
          onChange={(e) => {
            handleChange(e);
          }}
        >
          {currencyOption.map((currency) => {
            return (
              <option key={currency} value={currency}>
                {currency}
              </option>
            );
          })}
        </select>
      </div>
      <button onClick={handleSubmit}>Convert</button>
      {isReady ? (
        <span>{`${currencyData.amountOne}  ${currencyData.currencyOne} is Equals to ${currencyData.finalAmount}  ${currencyData.currencyTwo}`}</span>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
