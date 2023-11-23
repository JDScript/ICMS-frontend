import { useUser } from "@/contexts/user";
import { IconMail } from "@douyinfe/semi-icons";
import { Button, Descriptions, Space, Typography } from "@douyinfe/semi-ui";
import { useCountDown } from "ahooks";
import { FormattedRes } from "ahooks/lib/useCountDown";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpcomingSession = () => {
  const { enrolments } = useUser();
  const [anchorForCalc, setAnchor] = useState(dayjs.tz());
  const navigate = useNavigate();

  const nextOrCurrentSession = useMemo(() => {
    const now = dayjs.tz();
    const earliest: {
      start: null | Dayjs;
      end: null | Dayjs;
      venue: string;
      code: string;
      title: string;
      section: string;
      year: number;
      course_id: number;
    } = {
      start: null,
      end: null,
      venue: "",
      code: "",
      title: "",
      section: "",
      year: 0,
      course_id: 0,
    };

    for (const enrolment of enrolments) {
      const { course } = enrolment;
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
              earliest.code = course.code;
              earliest.title = course.title;
              earliest.section = course.section;
              earliest.year = course.year;
              earliest.course_id = course.id;
            }
            break;
          }
          date = date.add(1, "week");
        }
      }
    }
    return earliest;
  }, [enrolments, anchorForCalc]);

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
          border: "var(--semi-color-success) 1px solid",
          paddingBlock: 8,
          paddingInline: 12,
          backgroundColor: "var(--semi-color-success-light-default)",
          width: "100%",
          overflow: "hidden",
          marginBlock: 16,
        }}
      >
        <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
          All your enrolments have no future session, you've finished all your
          courses!
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
        marginBlock: 16,
      }}
    >
      {/* <Typography.Text style={{ color: "var(--semi-color-text-2)" }}>
        {inSession ? "Current" : "Next"}
      </Typography.Text>
      <Typography.Title>{nextOrCurrentSession.code}</Typography.Title> */}
      <Descriptions
        row
        data={[
          {
            key: inSession ? "Current" : "Next",
            value: `${nextOrCurrentSession.code} - ${nextOrCurrentSession.title} [Section ${nextOrCurrentSession.section}, ${nextOrCurrentSession.year}]`,
          },
        ]}
      />
      <Descriptions
        row
        size="small"
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
          {
            key: inSession ? "Ends" : "Starts",
            value: inSession
              ? formatCountDown(toEndFormatted)
              : formatCountDown(toStartFormatted),
          },
        ]}
      />
      <Space style={{ marginBlockStart: 8 }}>
        <Button
          theme="solid"
          onClick={() => {
            navigate(`/courses/${nextOrCurrentSession.course_id}`);
          }}
        >
          Enter course
        </Button>
        <Button theme="borderless" icon={<IconMail />}>
          Send by email
        </Button>
      </Space>
    </div>
  );
};

export default UpcomingSession;
