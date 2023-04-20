import { test, expect } from '@playwright/test';

const NAMES = ['이성진', '정문석', '심재훈', '윤도현', '양석진', '이혜민'];
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
  await page.goto('http://localhost:5173');
});

test('병원 만들고 멤버 초대, 수락, 탈퇴 하기', async ({ page }) => {
  const linkToLogin = page.getByRole('link', { name: '로그인', exact: true });
  const linkToSetting = page.getByRole('link', { name: '설정' });
  const alertModal = page.locator('#alert');
  const confirmModal = page.locator('#confirm');
  const alertCloseBtn = alertModal.getByText('창 닫기');
  const confirmAcceptBtn = confirmModal.getByText('초대하기');
  const confirmCloseBtn = confirmModal.getByText('초대하기');
  const emailInput = page.getByPlaceholder('Email을 입력하세요');
  const passwordInput = page.getByPlaceholder('비밀번호를 입력하세요');

  // test0으로 로그인해 병원 만든다
  await linkToLogin.click();
  await emailInput.fill(EMAIL[0]);
  await passwordInput.fill(PASSWORD);
  await passwordInput.press('Enter');

  await linkToSetting.click();
  await page.getByRole('link', { name: '병원 만들기' }).click();
  await page.locator('[id="병원이름"]').fill(CLINIC_NAME);
  await page.locator('[id="병원이름"]').press('Enter');
  await expect(page.getByText(/을 만들었습니다/)).toBeVisible();
  alertCloseBtn.click();

  // 만든 병원에 사용자를 초대한다

  await page.getByRole('link', { name: '병원', exact: true }).click();
  await page.locator('#clinic-selector').getByRole('button').click();
  await page
    .locator('#clinic-selector ul li')
    .getByRole('button', { name: '빕트 정형외과의원' })
    .click();

  for (let i = 1; i < NAMES.length; i += 1) {
    await page.getByRole('link', { name: '직원초대' }).click();
    await page.getByLabel('직원 이름').fill(NAMES[i]);
    await page.getByRole('button', { name: '초대하기' }).click();
    await expect(page.getByText(/을 초대합니다*/)).toBeVisible();
    await confirmCloseBtn.click();
    await alertCloseBtn.click();
  }

  await page.getByRole('button').getByText('로그아웃').click();

  // EMAIL[0]과 EMAIL[마지막] 제외 초대 수락한다

  const checkAgree = page.getByText('동의하기');
  const linkToMyClinic = page.getByRole('link', { name: '나의 병원' });

  for (let email of EMAIL) {
    if (email === EMAIL[0] || email === EMAIL.at(-1)) continue;
    await linkToLogin.click();
    await emailInput.fill(email);
    await passwordInput.fill(PASSWORD);
    await passwordInput.press('Enter');
    await linkToSetting.click();
    await linkToMyClinic.click();
    await page.getByRole('button', { name: '수락' }).click();
    await checkAgree.click();
    await page.getByRole('button', { name: '수락하기' }).click();
    await expect(alertModal).toHaveText(/초대를 수락했습니다/);
    await alertCloseBtn.click();
    await page.getByRole('button', { name: '로그아웃' }).click();
  }

  // EMAIL.at(-2)는 다시 탈퇴한다
  await linkToLogin.click();
  await emailInput.fill(EMAIL.at(-2) || '');
  await passwordInput.fill(PASSWORD);
  await passwordInput.press('Enter');
  await linkToSetting.click();
  await linkToMyClinic.click();
  await page
    .locator('.clinic-card', { hasText: CLINIC_NAME })
    .getByText('탈퇴하기')
    .click();
  await checkAgree.click();
  await confirmModal.getByRole('button').getByText('탈퇴하기').click();
  await expect(alertModal).toHaveText(/병원에서 탈퇴했습니다/);

  await page.close();
});
