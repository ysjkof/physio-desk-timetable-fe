import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { TABLE_TIME_GAP } from '../constants/constants';
import {
  compareDateMatch,
  getTimeGaps,
  newDateFromHoursAndMinute,
} from '../services/dateServices';
import { viewOptionsVar } from '../store';

export default function useViewoptions() {
  const viewOptions = useReactiveVar(viewOptionsVar);

  const [labels, setLabels] = useState(
    getTimeGaps(
      viewOptions.tableDuration.start.hours,
      viewOptions.tableDuration.start.minutes,
      viewOptions.tableDuration.end.hours,
      viewOptions.tableDuration.end.minutes,
      TABLE_TIME_GAP
    )
  );

  const isChangeOption = () => {
    compareDateMatch(
      newDateFromHoursAndMinute(
        viewOptions.tableDuration.start.hours,
        viewOptions.tableDuration.start.minutes
      ),
      newDateFromHoursAndMinute(
        viewOptions.tableDuration.end.hours,
        viewOptions.tableDuration.end.minutes
      ),
      'hm'
    );
  };

  return { labels, setLabels };
}
