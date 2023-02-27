import { test, expect } from '@playwright/test';

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

  const clinicSelector = page.locator('.clinic-selector');
  await clinicSelector.click();
  await clinicSelector.getByText(CLINIC_NAME).click();
});

const ATOMS = {
  1: '도수',
  2: '충격파',
};

const PRESCRIPTIONS = [
  {
    name: '도수30',
    atom: [1],
    requiredTime: '30',
    price: '70000',
    description: '',
  },
  {
    name: '도수60',
    atom: [1],
    requiredTime: '60',
    price: '130000',
    description: '',
  },
];

test('처방 만들기', async ({ page }) => {
  const alertModal = page.locator('#alert');

  await page.goto('http://localhost:5173/dashboard/clinic/prescriptions');

  await page.getByText('처방 만들기').click();
  expect(
    page.locator('h1.modal-header', { hasText: '처방 만들기' })
  ).toBeVisible();

  for (let prescription of PRESCRIPTIONS) {
    await page.getByLabel('이름').fill(prescription.name);
    for (let atom of prescription.atom) {
      // @ts-ignore
      await page.getByLabel(ATOMS[atom]).check();
    }
    await page.getByLabel('소요시간').fill(prescription.requiredTime);
    await page.getByLabel('가격').fill(prescription.price);
    await page.getByLabel('설명').fill(prescription.description);

    await page.getByRole('button', { name: '만들기' }).click();

    // 만들기가 성공했는지 실패했는지는 확인안했다
    await alertModal.getByRole('button', { name: '창 닫기' }).click();
  }

  await page.close();
});
