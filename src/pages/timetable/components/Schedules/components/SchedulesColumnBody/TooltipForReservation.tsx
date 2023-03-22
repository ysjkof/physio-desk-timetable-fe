import { useEffect, useRef, useState } from 'react';
import { ReservationDetail } from '../../../ReservationDetail';
import type { ReservationOfGetReservationsByInterval } from '../../../../../../types/processedGeneratedTypes';
interface TooltipForReservationDetailProps {
  reservation: ReservationOfGetReservationsByInterval;
  boxRect: DOMRect | undefined;
}

const TooltipForReservationDetail = (
  props: TooltipForReservationDetailProps
) => {
  const { reservation, boxRect } = props;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipRect, setTooltipRect] = useState<DOMRect>();

  const getTooltipPosition = () => {
    if (!tooltipRect || !boxRect) {
      throw new Error('tooltipRect or boxRect is undefined');
    }

    const schedulesContainer = document.getElementById('timetable__schedules');
    if (!schedulesContainer) {
      throw new Error('schedulesContainer is undefined');
    }

    const globalAside = document.getElementById('global-aside');
    if (!globalAside) {
      throw new Error('globalAside is undefined');
    }
    const asideWidth = globalAside.clientWidth;

    const label = document.getElementById('schedules__time-label');
    if (!label) {
      throw new Error('globalAside is undefined');
    }
    const labelWidth = label.clientWidth;

    const { width: tooltipWidth, height: tooltipHeight } = tooltipRect;

    const {
      width: boxWidth,
      top: boxTop,
      right: boxRight,
      left: boxLeft,
    } = boxRect;

    const {
      height: containerHeight,
      top: containerTop,
      bottom: containerBottom,
      right: containerRight,
      left: containerLeft,
    } = schedulesContainer.getBoundingClientRect();

    // 툴팁의 기본 위치
    const tooltipTop = boxTop - 20;
    const tooltipBottom = tooltipTop + tooltipHeight;
    const tooltipLeft = boxRight - boxWidth / 2;
    const tooltipLeftWhenRightOverflowing = boxLeft - tooltipWidth;
    const tooltipRight = tooltipLeft + tooltipWidth;

    const columnLeft = asideWidth + labelWidth;

    const position = {
      top: tooltipTop,
      left: tooltipLeft,
    };

    if (tooltipTop < containerTop) {
      position.top = containerTop;
    }
    if (tooltipBottom > containerBottom) {
      position.top = containerBottom - tooltipHeight - 8;
    }
    if (containerHeight < tooltipHeight) {
      position.top = containerTop;
    }

    if (tooltipRight > containerRight) {
      position.left =
        tooltipLeftWhenRightOverflowing < containerLeft
          ? columnLeft
          : tooltipLeftWhenRightOverflowing;
    }

    return position;
  };

  const setTooltipPosition = ({ top, left }: { top: number; left: number }) => {
    if (!tooltipRef.current) {
      throw new Error('tooltipRef is undefined');
    }
    tooltipRef.current.style.top = top + 'px';
    tooltipRef.current.style.left = left + 'px';
  };

  useEffect(() => {
    if (!tooltipRef.current) return;
    setTooltipRect(tooltipRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    if (!tooltipRect || !boxRect) return;
    setTooltipPosition(getTooltipPosition());
  }, [tooltipRect, boxRect]);

  return (
    <div
      ref={tooltipRef}
      className="fixed cursor-default rounded border border-navy bg-white shadow-cst"
    >
      <ReservationDetail reservation={reservation} />
    </div>
  );
};

export default TooltipForReservationDetail;
