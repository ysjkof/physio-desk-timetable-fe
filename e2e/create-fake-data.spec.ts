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

test.afterAll(async ({ page }) => {
  await page.close();
});

test.describe('테스트를 위한 회원가입 등 자료 생성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('6개의 계정 만들기', async ({ page }) => {
    const linkToLogin = page.getByRole('link', { name: '로그인/회원가입' });
    const linkOfSignUp = page.getByRole('link', {
      name: '계정이 없습니까?회원가입',
    });

    const signupEmail = page.getByPlaceholder(
      '로그인에 사용할 Email을 입력하세요'
    );
    const signupName = page.getByPlaceholder('이름을 입력하세요');
    const passwordInput = page.getByPlaceholder('비밀번호를 입력하세요');
    const alertCloseBtn = page.locator('#alert').getByText('창 닫기');
    const alertContainer = page.getByText(
      /입력한 주소로 인증 이메일을 전송했습니다./
    );

    for (let i = 0; i < NAMES.length; i += 1) {
      await linkToLogin.click();
      await linkOfSignUp.click();

      await signupEmail.fill(EMAIL[i]);
      await signupName.fill(NAMES[i]);
      await passwordInput.fill(PASSWORD);
      await passwordInput.press('Enter');

      await expect(alertContainer).toBeVisible();
      await alertCloseBtn.click();
    }
  });

  test('병원 만들고 멤버 초대, 수락, 탈퇴 하기', async ({ page }) => {
    const linkToLogin = page.getByRole('link', { name: '로그인/회원가입' });
    const linkToSetting = page.getByRole('link', { name: '설정' });
    const alertModal = page.locator('#alert');
    const alertCloseBtn = alertModal.getByText('창 닫기');
    const emailInput = page.getByPlaceholder('Email을 입력하세요');
    const passwordInput = page.getByPlaceholder('비밀번호를 입력하세요');

    // test0으로 로그인해 병원 만든다
    await linkToLogin.click();
    await emailInput.fill(EMAIL[0]);
    await passwordInput.fill(PASSWORD);
    await passwordInput.press('Enter');

    await linkToSetting.click();
    await page.getByRole('link', { name: '병원 만들기' }).click();
    await page
      .locator('[id="form-of-reserve__input-병원이름"]')
      .fill(CLINIC_NAME);
    await page.locator('[id="form-of-reserve__input-병원이름"]').press('Enter');
    await expect(page.getByText(/을 만들었습니다/)).toBeVisible();
    alertCloseBtn.click();

    // 만든 병원에 사용자를 초대한다

    await page.getByRole('link', { name: '병원', exact: true }).click();
    await page.getByRole('group').locator('svg').click();
    await page.getByRole('button', { name: '빕트 정형외과의원' }).click();

    for (let i = 1; i < NAMES.length; i += 1) {
      await page.getByRole('link', { name: '직원초대' }).click();
      await page.getByLabel('직원 이름').fill(NAMES[i]);
      await page.getByRole('button', { name: '만들기' }).click();
      await expect(page.getByText(/을 초대했습니다*/)).toBeVisible();
      await alertCloseBtn.click();
    }

    const logoutBtn = page.getByRole('button').getByText('로그아웃');
    await logoutBtn.click();
    await linkToLogin.click();

    // test2~test5까지 초대 수락하고 5는 다시 탈퇴한다

    const openApplyModalBtn = page.getByRole('button', { name: '수락' });
    const checkAgree = page.getByText('동의하기');
    const applyBtn = page.getByRole('button', { name: '수락하기' });
    const linkToMyClinic = page.getByRole('link', { name: '나의 병원' });

    for (let i = 1; i < 5; i += 1) {
      await linkToLogin.click();
      await emailInput.fill(EMAIL[i]);
      await passwordInput.fill(PASSWORD);
      await passwordInput.press('Enter');
      await linkToSetting.click();
      await linkToMyClinic.click();
      await openApplyModalBtn.click();
      await checkAgree.click();
      await applyBtn.click();
      await expect(alertModal).toHaveText(/초대를 수락했습니다/);
      await alertCloseBtn.click();
      await page.getByRole('button', { name: '로그아웃' }).click();
    }

    const confirmModal = page.locator('#confirm');

    await linkToLogin.click();
    await emailInput.fill(EMAIL[4]);
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
  });
});

test.describe('주 병원 세팅하기', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    const emailInput = page.getByPlaceholder('Email을 입력하세요');
    const passwordInput = page.getByPlaceholder('비밀번호를 입력하세요');
    const clinicSelector = page.locator('.clinic-selector');

    await emailInput.fill(EMAIL[0]);
    await passwordInput.fill(PASSWORD);
    await passwordInput.press('Enter');

    await clinicSelector.click();
    await clinicSelector.getByText(CLINIC_NAME).click();
  });

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
      await page.locator('input[name="name"]').fill(prescription.name);
      for (let atom of prescription.atom) {
        const label = atom === 1 ? '도수' : '충격파';
        await page.getByLabel(label).check();
      }
      await page
        .locator('input[name="requiredTime"]')
        .fill(prescription.requiredTime);
      await page.locator('input[name="price"]').fill(prescription.price);
      await page
        .locator('textarea[name="description"]')
        .fill(prescription.description);

      await page.getByRole('button').getByText('만들기').click();
      await alertModal.getByRole('button').getByText('창 닫기').click();
    }
  });

  const PATIENTS = [
    { name: '환자일', gender: '남성' },
    { name: '환자이', gender: '남성' },
    { name: '환자삼', gender: '남성' },
    { name: '환자사', gender: '남성' },
    { name: '환자오', gender: '남성' },
    { name: '환자육', gender: '여성' },
    { name: '환자칠', gender: '여성' },
    { name: '환자팔', gender: '여성' },
    { name: '환자구', gender: '여성' },
    { name: '환자십', gender: '여성' },
    { name: '공공일', gender: '남성', birthday: '20100101' },
    { name: '공공이', gender: '남성', birthday: '20100201' },
    { name: '공공삼', gender: '남성', birthday: '20100301' },
    { name: '공공사', gender: '남성', birthday: '20100401' },
    { name: '공공오', gender: '여성', birthday: '20100501' },
    { name: '공공육', gender: '여성', birthday: '20100601' },
    { name: '공공칠', gender: '여성', birthday: '20100701' },
    { name: '공공팔', gender: '여성', birthday: '20100801' },
    { name: '공공구', gender: '여성', birthday: '20100901' },
    { name: '공일공', gender: '여성', birthday: '20101001' },
    { name: '공일일', gender: '여성', birthday: '20101101' },
    { name: '공일이', gender: '여성', birthday: '20101201' },
  ];

  test('환자 만들기', async ({ page }) => {
    await page.goto('http://localhost:5173/tt');

    for (const { name, gender, birthday } of PATIENTS) {
      await page.getByText('환자 등록하기', { exact: true }).click();
      await page.getByLabel('이름').fill(name);
      await page.getByLabel(gender === '남성' ? '남성' : '여성').check();
      await page.getByText('등록하기', { exact: true }).click();
      await page.getByLabel('생일').fill(birthday || '');

      const alertCloseBtn = page.locator('#alert').getByText('창 닫기');
      await expect(alertCloseBtn).toBeVisible();
      await alertCloseBtn.click();
    }
  });
});
