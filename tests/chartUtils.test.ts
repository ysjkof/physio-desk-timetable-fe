import { assert, describe, it } from 'vitest';
import { getReportsByUser } from '../src/utils/chartUtils';
import { dailyReports, result } from './mock/chartUtils.mock';

describe('chartUtils 테스트', () => {
  it('getReportsByUser', () => {
    //@ts-ignore
    assert.deepEqual(getReportsByUser(dailyReports), result);
  });
});
