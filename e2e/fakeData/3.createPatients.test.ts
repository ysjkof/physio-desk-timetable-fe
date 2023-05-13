import { test } from '@playwright/test';

const EMAIL = [
  'test@t.co',
  'test1@t.co',
  'test2@t.co',
  'test3@t.co',
  'test4@t.co',
  'test5@t.co',
];
const PASSWORD = '123';
const CLINIC_NAME = '빕트 정형외과의원';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('Email을 입력하세요').fill(EMAIL[0]);
  await page.getByPlaceholder('비밀번호를 입력하세요').fill(PASSWORD);
  await page.getByPlaceholder('비밀번호를 입력하세요').press('Enter');

  const clinicSelector = page.locator('#clinic-selector');
  await clinicSelector.click();
  await clinicSelector.getByText(CLINIC_NAME).click();
});

const PATIENTS = [
  { name: '환자일', gender: '남성', birthday: '' },
  { name: '환자이', gender: '남성', birthday: '' },
  { name: '환자삼', gender: '남성', birthday: '', phone: '01012341234' },
  { name: '환자사', gender: '남성', birthday: '', phone: '01012341234' },
  { name: '환자오', gender: '남성', birthday: '', phone: '01012341234' },
  { name: '환자육', gender: '여성', birthday: '', phone: '01012341234' },
  { name: '환자칠', gender: '여성', birthday: '', phone: '01012341234' },
  { name: '환자팔', gender: '여성', birthday: '', phone: '01012341234' },
  { name: '환자구', gender: '여성', birthday: '', phone: '01012341234' },
  { name: '환자십', gender: '여성', birthday: '', phone: '01012341234' },
  {
    name: '공공일',
    gender: '남성',
    birthday: '20100101',
    phone: '01012341234',
  },
  {
    name: '공공이',
    gender: '남성',
    birthday: '20100201',
    phone: '01012341234',
  },
  {
    name: '공공삼',
    gender: '남성',
    birthday: '20100301',
    phone: '01012341234',
  },
  {
    name: '공공사',
    gender: '남성',
    birthday: '20100401',
    phone: '01012341234',
  },
  {
    name: '공공오',
    gender: '여성',
    birthday: '20100501',
    phone: '01012341234',
  },
  { name: '공공육', gender: '여성', birthday: '20100601' },
  { name: '공공칠', gender: '여성', birthday: '20100701' },
  { name: '공공팔', gender: '여성', birthday: '20100801' },
  { name: '공공구', gender: '여성', birthday: '20100901' },
  { name: '공일공', gender: '여성', birthday: '20101001' },
  { name: '공일일', gender: '여성', birthday: '20101101' },
  { name: '공일이', gender: '여성', birthday: '20101201' },
];

test('환자 만들기', async ({ page }) => {
  for (const { name, gender, birthday, phone } of PATIENTS) {
    await page.getByRole('button', { name: '환자 등록하기' }).click();

    await page.getByLabel('이름').fill(name);
    await page.getByLabel(gender).check();
    await page.getByLabel('생일').fill(birthday || '');
    await page.getByLabel('연락처').fill(phone || '');

    await page.getByRole('button', { name: '등록하기', exact: true }).click();

    await page.getByRole('button', { name: '창 닫기' }).click();
  }

  await page.close();
});
