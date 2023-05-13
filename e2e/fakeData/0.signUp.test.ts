import { test, expect } from '@playwright/test';

const NAMES = ['이성진', '정문석', '심재훈', '윤도현', '양석진', '이혜민'];
const NICKNAMES = ['이성', '정문', '심재', '윤도', '양석', '이혜'];
const EMAIL = [
  'test@t.co',
  'test1@t.co',
  'test2@t.co',
  'test3@t.co',
  'test4@t.co',
  'test5@t.co',
];
const PASSWORD = '123';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('6개의 계정 만들기', async ({ page }) => {
  const linkToLogin = page
    .locator('header')
    .getByRole('link', { name: '로그인', exact: true });
  const linkOfSignUp = page.getByRole('link', {
    name: '계정이 없습니까?회원가입',
  });

  const signupEmail = page.getByPlaceholder('로그인 아이디(ID)로 사용합니다');
  const signupName = page.getByPlaceholder('변경할 수 없고 화면에 표시됩니다');
  const signupNickname = page.getByPlaceholder('화면에 표시됩니다', {
    exact: true,
  });
  const passwordInput = page.getByPlaceholder('비밀번호', { exact: true });
  const passwordInput2 = page.getByPlaceholder('비밀번호 확인', {
    exact: true,
  });
  const agreementsCheckbox = page.locator('#requiredAgreements');
  const alertCloseBtn = page.locator('#alert').getByText('창 닫기');
  const alertContainer = page.getByText(/인증 이메일 전송을 요청했습니다./);

  for (const email of EMAIL) {
    await linkToLogin.click();
    await linkOfSignUp.click();

    await signupEmail.fill(email);
    await signupName.fill(NAMES[EMAIL.indexOf(email)]);
    await signupNickname.fill(NICKNAMES[EMAIL.indexOf(email)]);
    await passwordInput.fill(PASSWORD);
    await passwordInput2.fill(PASSWORD);
    await agreementsCheckbox.check();
    await passwordInput2.press('Enter');

    await expect(alertContainer).toBeVisible();
    await alertCloseBtn.click();
  }

  await page.close();
});
