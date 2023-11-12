import { Descriptions, Typography } from "@douyinfe/semi-ui";
import { useCountDown } from "ahooks";
import type { FormattedRes } from "ahooks/lib/useCountDown";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";

const NextOrCurrentSession = ({ course }: { course: API.Course }) => {
  const [anchorForCalc, setAnchor] = useState(dayjs.tz());
  const nextOrCurrentSession = useMemo(() => {
    const now = dayjs.tz();
    const earliest: {
      start: null | Dayjs;
      end: null | Dayjs;
      venue: string;
    } = {
      start: null,
      end: null,
      venue: "",
    };

    for (const slot of course.slots) {
      const slotStartDate = dayjs.tz(slot.start_date);
      const slotEndDate = dayjs.tz(slot.end_date).endOf("day");

      if (
        slotStartDate.isAfter(now.endOf("day")) ||
        slotEndDate.isBefore(now.startOf("day"))
      ) {
        continue;
      }

      // Find the earliest session for this slot
      let date = slotStartDate;
      while (date.isBefore(slotEndDate)) {
        const dateStr = date.format("YYYY-MM-DDT");
        const slotStartTime = dayjs.tz(dateStr + slot.start_time);
        const slotEndTime = dayjs.tz(dateStr + slot.end_time);

        if (slotEndTime.isAfter(now)) {
          if (
            earliest.start == null ||
            slotStartTime.isBefore(earliest.start)
          ) {
            earliest.start = slotStartTime;
            earliest.end = slotEndTime;
            earliest.venue = slot.venue;
          }
          break;
        }
        date = date.add(1, "week");
      }
    }

    return earliest;
  }, [course, anchorForCalc]);

  const [toSessionStart, toStartFormatted] = useCountDown({
    targetDate: nextOrCurrentSession.start,
  });

  const [toSessionEnd, toEndFormatted] = useCountDown({
    targetDate: nextOrCurrentSession.end,
  });

  const inSession = useMemo(
    () => toSessionStart == 0 && toSessionEnd > 0,
    [toSessionStart, toSessionEnd]
  );

  useEffect(() => {
    if (
      toSessionEnd == 0 &&
      toSessionStart == 0 &&
      nextOrCurrentSession.start != null
    ) {
      setAnchor(dayjs.tz());
    }
  }, [toSessionStart, toSessionEnd, nextOrCurrentSession]);

  const formatCountDown = (res: FormattedRes) => {
    return `${res.hours + res.days * 24}:${res.minutes
      .toString()
      .padStart(2, "0")}:${res.seconds.toString().padStart(2, "0")}`;
  };

  if (nextOrCurrentSession.start == null) {
    return (
      <div
        style={{
          borderRadius: 8,
          boxSizing: "border-box",
          border: "var(--semi-color-danger) 1px solid",
          paddingBlock: 8,
          paddingInline: 12,
          backgroundColor: "var(--semi-color-danger-light-default)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
          No future session, all sessions are ended
        </Typography.Text>
        <Typography.Title>∞</Typography.Title>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 8,
        boxSizing: "border-box",
        border: inSession
          ? "var(--semi-color-warning) 1px solid"
          : "var(--semi-color-primary) 1px solid",
        paddingBlock: 8,
        paddingInline: 12,
        backgroundColor: inSession
          ? "var(--semi-color-warning-light-default)"
          : "var(--semi-color-primary-light-default)",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
        {inSession ? "Current session ends in" : "To next session"}
      </Typography.Text>
      <Typography.Title>
        {inSession
          ? formatCountDown(toEndFormatted)
          : formatCountDown(toStartFormatted)}
      </Typography.Title>
      <Descriptions
        size="small"
        row
        data={[
          {
            key: "Start",
            value: nextOrCurrentSession.start.format("YYYY-MM-DD HH:mm [HKT]"),
          },
          {
            key: "End",
            value: nextOrCurrentSession.end?.format("YYYY-MM-DD HH:mm [HKT]"),
          },
          {
            key: "Venue",
            value: nextOrCurrentSession.venue,
          },
        ]}
      />
    </div>
  );
};

export default NextOrCurrentSession;
