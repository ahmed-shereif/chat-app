function getQueryData(query) {
  const firstArr = query.split("?");
  const secondArr = firstArr.pop().split("&");
  const thirdArr = secondArr.map((el) => el.split("="));

  return {
    username: thirdArr[0][1],
    room: thirdArr[1][1],
  };
}

export { getQueryData };
