export const REGEX = {
  // console.log(pattern.test("2020-10-31")); 결과 : true
  // console.log(pattern.test("20201030")); 결과 : false
  // console.log(pattern.test("2020-10-32"));결과 : false
  YYYYMMDD: /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/,
  // console.log(pattern.test("01:21")); 결과 : true
  // console.log(pattern.test("01:61")); 결과 : false
  // console.log(pattern.test("1:21")); 결과 : true
  // console.log(pattern.test("1:61")); 결과 : false
  // console.log(pattern.test("24:21")); 결과 : false
  // export const REGEX_HHMM = /^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/;
  // 이하는 1분 단위는 0만 가능
  HHMM: /^([1-9]|[01][0-9]|2[0-3]):([0-5][0])$/,
  NUMBER_END_DIGIT_OF_ZERO: /^[0-9]*0$/,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};
