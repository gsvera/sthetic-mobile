export const convertCurrency = (n:number) => {
    let currencyLocal = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  
    return currencyLocal.format(n);
  };