export const REG_EXP = {
  numberEnd0: { pattern: /^[0-9]*0$/, condition: '10분 단위로 입력' },
  email: {
    pattern:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    condition: 'Email형식으로 입력하세요',
  },
  password: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
    condition: '8~30자로 영어 소문자, 숫자, 특수문자를 사용할 수 있습니다',
  },
  personName: {
    pattern: /^([가-힣\d\.]{2,10}|[a-z\d\. ,.'-]{6,30})+$/i,
    condition: '숫자, 온점(.) 포함, 한글 2~10자, 영문 6~30자 입니다',
  },
  clinicName: {
    pattern: /^([ㄱ-ㅎ가-힣a-zA-Z\d ]{4,30})$/,
    condition: '4~30자로 한글, 영문, 숫자를 사용할 수 있습니다',
  },
  prescription: {
    pattern: /^[ㄱ-ㅎ가-힣a-zA-Z@!%*#&\d]{3,15}$/,
    condition:
      '3~15자로 한글, 영문, 숫자, 특수문자(@!%*#&)를 사용할 수 있습니다',
  },
};

const year = /^(19|20)\d{2}$/;
const month = /^(0[1-9]|1[012])$/;
const day = /^([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
const hour = /^(0[0-9]|1[0-9]|2[0-3])$/;
const minute = /^([1-5][0])$/;

export const REG_EXP_DATEPICKER = {
  year,
  month,
  day,
  hour,
  minute,
};
