import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

export const Humanized = (date:Date) =>
{
    dayjs.extend(duration);
    dayjs.extend(relativeTime);
    dayjs.locale('fa')

    return dayjs().to(dayjs(date))
}