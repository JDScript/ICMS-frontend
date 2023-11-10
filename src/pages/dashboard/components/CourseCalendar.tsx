import { useUser } from "@/contexts/user";
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

const CourseCalendar = () => {
  const [anchorDate, setAnchorDate] = useState(dayjs());

  const startOfWeek = useMemo(() => anchorDate.startOf("week"), [anchorDate]);
  const endOfWeek = useMemo(() => anchorDate.endOf("week"), [anchorDate]);

  const { enrolments } = useUser();

  const events = useMemo(() => {
    const evs: EventObject[] = [];
    for (const { course } of enrolments) {
      const ev = course.slots
        .filter((slot) => {
          return (
            dayjs(slot.start_date).isBefore(endOfWeek) &&
            dayjs(slot.end_date).isAfter(startOfWeek)
          );
        })
        .map((slot) => ({
          key: course.id + slot.start_date,
          allDay: false,
          start: dayjs(
            `${startOfWeek.add(slot.day, "day").format("YYYY-MM-DD")} ${
              slot.start_time
            }`
          ).toDate(),
          end: dayjs(
            `${startOfWeek.add(slot.day, "day").format("YYYY-MM-DD")} ${
              slot.end_time
            }`
          ).toDate(),
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
              }}
            >
              <Typography.Text style={{ margin: -1 }}>
                {course.code} - {course.section}
                <br />
                <Typography.Text
                  style={{ fontSize: 11, color: "var(--semi-color-text-2)" }}
                >
                  {slot.venue}
                </Typography.Text>
              </Typography.Text>
            </div>
          ),
        }));
      evs.push(...ev);
      console.log(evs);
    }
    return evs;
  }, [startOfWeek, endOfWeek, enrolments]);

  return (
    <div style={{ width: "calc(100vw - 48px)", marginBlock: 12 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Button onClick={() => setAnchorDate(dayjs())}>Today</Button>
        <ButtonGroup>
          <Button onClick={() => setAnchorDate((prev) => prev.add(-1, "week"))}>
            Previous Week
          </Button>
          <Button onClick={() => setAnchorDate((prev) => prev.add(1, "week"))}>
            Next Week
          </Button>
        </ButtonGroup>
      </Space>
      <Calendar
        mode="week"
        style={{ borderRadius: 8, marginBlock: 12 }}
        events={events}
        markWeekend
        displayValue={anchorDate.toDate()}
      />
    </div>
  );
};

export default CourseCalendar;
