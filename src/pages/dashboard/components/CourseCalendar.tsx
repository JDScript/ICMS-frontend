import { useUser } from "@/contexts/user";
import { IconArrowLeft, IconArrowRight } from "@douyinfe/semi-icons";
import {
  Button,
  ButtonGroup,
  Calendar,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import type { EventObject } from "@douyinfe/semi-ui/lib/es/calendar";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CourseCalendarProps {
  mode?: "day" | "month" | "week";
}

const CourseCalendar = (props: CourseCalendarProps) => {
  const { mode = "week" } = props;

  const [anchorDate, setAnchorDate] = useState(dayjs.tz());

  const startOfCalendar = useMemo(
    () => anchorDate.startOf(mode).add(-1, mode),
    [anchorDate, mode]
  );
  const endOfCalendar = useMemo(
    () => anchorDate.endOf(mode).add(1, mode),
    [anchorDate, mode]
  );

  const { enrolments } = useUser();
  const navigate = useNavigate();

  const events = useMemo(() => {
    const evs: EventObject[] = [];
    for (const { course } of enrolments) {
      const filteredSlots = course.slots.filter((slot) => {
        return (
          !dayjs.tz(slot.end_date).isBefore(startOfCalendar) &&
          !dayjs.tz(slot.start_date).isAfter(endOfCalendar)
        );
      });

      for (const slot of filteredSlots) {
        let date = dayjs.tz(slot.start_date);
        const endDate = dayjs.tz(slot.end_date).endOf("day");
        while (date.isBefore(endOfCalendar) && date.isBefore(endDate)) {
          if (date.isSame(startOfCalendar) || date.isAfter(startOfCalendar)) {
            const today = date.format("YYYY-MM-DDT");
            evs.push({
              key: `${course.code}_${course.section}-${today}-${slot.start_time}-${slot.end_time}`,
              start: dayjs.tz(today + slot.start_time).toDate(),
              end: dayjs.tz(today + slot.end_time).toDate(),
              allDay: false,
              children: (
                <div
                  style={{
                    borderRadius: 8,
                    boxSizing: "border-box",
                    border: "var(--semi-color-primary) 1px solid",
                    paddingBlock: 4,
                    paddingInline: 8,
                    backgroundColor: "var(--semi-color-primary-light-default)",
                    height: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <Typography.Text style={{ margin: -1 }}>
                    {course.code} - {course.section}
                    <br />
                    <Typography.Text
                      style={{
                        fontSize: 11,
                        color: "var(--semi-color-text-2)",
                      }}
                    >
                      {slot.venue}
                    </Typography.Text>
                  </Typography.Text>
                </div>
              ),
            });
          }
          date = date.add(1, "week");
        }
      }
    }
    return evs;
  }, [startOfCalendar, endOfCalendar, enrolments]);

  return (
    <div
      style={{
        width: "100%",
        overflow: "auto",
        display: "grid",
        marginBlock: 12,
      }}
    >
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography.Text strong style={{ color: "var(--semi-color-text-2)" }}>
          {mode === "day" && anchorDate.format("MMM D, YYYY ")}
        </Typography.Text>
        <ButtonGroup>
          <Button onClick={() => setAnchorDate(dayjs.tz())}>Today</Button>
          <Button
            onClick={() => setAnchorDate((prev) => prev.add(-1, mode))}
            icon={<IconArrowLeft />}
          />
          <Button
            onClick={() => setAnchorDate((prev) => prev.add(1, mode))}
            icon={<IconArrowRight />}
          />
        </ButtonGroup>
      </Space>
      <Typography.Text
        style={{ color: "var(--semi-color-text-2)", marginBlock: 8 }}
      >
        Calendar is shown in timezone: {dayjs.tz.guess()}
      </Typography.Text>
      <Calendar
        mode={mode}
        style={{ borderRadius: 8, width: "100%" }}
        events={events}
        markWeekend
        displayValue={anchorDate.toDate()}
        showCurrTime={dayjs
          .tz()
          .startOf("day")
          .isSame(anchorDate.startOf("day"))}
        scrollTop={500}
      />
    </div>
  );
};

export default CourseCalendar;
