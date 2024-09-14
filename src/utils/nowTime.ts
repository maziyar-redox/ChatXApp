import moment from "moment";

export default function getNowTime() {
    const getNowTime = moment(new Date());
    const formatTime = getNowTime.format("h:mm:ss a");
    return formatTime;
};