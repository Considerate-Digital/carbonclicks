import type { View } from "$lib/types/dashboard";
import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
import { co2, averageIntensity } from "@tgwf/co2";

async function getUserCarbon(view: View) {
  const emissions = new co2({ model: "1byte" });
  const co2js_options = {
    gridIntensity: {
      device: {
        country: view.country,
      },
      /* TODO don't think we know this 
                        dataCenter: {
                            country: server_location
                        }
                        */
    },
  };
  let emission_data = emissions.perByteTrace(
    view.transfer,
    view.green,
    co2js_options,
  );
  return emission_data.co2;
}

interface Point {
  timeUnit: string | number;
  count: number;
  users: number;
  carbon: number;
}

onmessage = async (e) => {
  //let data = e.data;

  let { timePeriod, views } = bufferToObject(e.data);
  let carbonArr = [];
  let visitArr = [];
  let userArr = [];
  let labels = [];
  let graphData: Point[] = [];
  async function sortData() {
    console.log("sorting data");
    let monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    switch (timePeriod) {
      case "week":
        //get names of last 7 days
        async function sort_days() {
          let day_of_week = new Date().getDay(); //returns number
          let list: string[] = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ];
          let sortedList: string[] = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ];

          //get index of day_of_week
          //remove all values after index and put them at front of array
          let removedDays = sortedList.splice(day_of_week + 1, Infinity);
          removedDays.reverse();
          removedDays.forEach((day) => {
            if (day == list[day_of_week]) {
              sortedList.push(day);
            } else {
              sortedList.unshift(day);
            }
          });
          return sortedList;
        }

        let weekArray = [];
        let sortedWeek = await sort_days();

        for (let i = 0; sortedWeek.length > i; i++) {
          let day = sortedWeek[i];
          let dbBit: Point = {
            timeUnit: day,
            count: 0,
            users: 0,
            carbon: 0,
          };
          weekArray.push(dbBit);
        }

        for (let i = 0; views.length > i; i++) {
          let view = views[i];
          var list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          let day = list[new Date(view.date).getDay()];
          //console.log(day);
          let dayIndex = sortedWeek.indexOf(day);
          //console.log(dayIndex);
          let carbon = await getUserCarbon(view);
          weekArray[dayIndex].carbon += Number(Number(carbon).toFixed(2));
          weekArray[dayIndex].count += 1;
          if (new Boolean(Number(view.unique_view)) == true) {
            weekArray[dayIndex].users += 1;
          }
        }
        graphData = weekArray;
        break;
      case "month":
        let daysInCurrentMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          0,
        ).getDate(); // effectively the last 30 days;
        function sortDaysOfMonth() {
          let list = Array.from(
            { length: daysInCurrentMonth },
            (_, i) => i + 1,
          );
          let day_of_week = new Date().getDate();
          let sortedList = Array.from(
            { length: daysInCurrentMonth },
            (_, i) => i + 1,
          );

          //remove all values after index and put them at front of array
          let removedDays = sortedList.splice(day_of_week, Infinity);
          removedDays.reverse();
          removedDays.forEach((day) => {
            if (day == list[day_of_week]) {
              //list.push(day);
            } else {
              sortedList.unshift(day);
            }
          });
          sortedList.reverse();
          sortedList.push(list[day_of_week]);
          sortedList.reverse();
          return sortedList;
        }
        let monthArray = [];
        let sortedmonth = await sortDaysOfMonth();

        for (let i = 0; sortedmonth.length > i; i++) {
          let day = sortedmonth[i];
          let dbBit: Point = {
            timeUnit: day,
            count: 0,
            users: 0,
            carbon: 0,
          };
          monthArray.unshift(dbBit);
        }
        //TODO remove this?
        monthArray.reverse();

        for (let i = 0; views.length > i; i++) {
          let view = views[i];
          let list = Array.from(
            { length: daysInCurrentMonth },
            (_, i) => i + 1,
          );
          let day = list[new Date(view.date).getDate() - 1];
          let dayIndex = sortedmonth.indexOf(day);
          let carbon = await getUserCarbon(view);
          monthArray[dayIndex].carbon += Number(Number(carbon).toFixed(2));
          monthArray[dayIndex].count += 1;
          if (new Boolean(Number(view.unique_view)) == true) {
            monthArray[dayIndex].users += 1;
          }
        }
        graphData = monthArray;
        break;
      case "sixMonth":
        let monthsInFullYear = 12;
        let monthsInHalfYear = 6;
        function sortMonthsInHalfYear() {
          let currentMonth = new Date().getMonth() + 1;
          let list = Array.from({ length: monthsInHalfYear }, (_, i) => {
            i = currentMonth - i;
            if (i > 12) {
              i -= 12;
            }
            if (i < 1) {
              i += 12;
            }
            return i;
          });

          let sortedList = list;
          return sortedList;
        }
        let halfYearArray = [];
        let sortedHalfYear = await sortMonthsInHalfYear();

        for (let i = 0; sortedHalfYear.length > i; i++) {
          let day = sortedHalfYear[i];
          let dbBit: Point = {
            timeUnit: monthNames[day - 1],
            count: 0,
            users: 0,
            carbon: 0,
          };
          halfYearArray.push(dbBit);
        }

        for (let i = 0; views.length > i; i++) {
          let view = views[i];
          let currentMonth = new Date().getMonth() + 1;
          let list = Array.from({ length: monthsInHalfYear }, (_, i) => {
            i = currentMonth - i;
            if (i > 12) {
              i -= 12;
            }
            if (i < 1) {
              i += 12;
            }
            return i;
          });
          let day = new Date(view.date).getMonth() + 1;
          let dayIndex = sortedHalfYear.indexOf(day);
          let carbon = await getUserCarbon(view);
          if (halfYearArray[dayIndex]) {
            halfYearArray[dayIndex].carbon += Number(Number(carbon).toFixed(2));
            halfYearArray[dayIndex].count += 1;
            if (new Boolean(Number(view.unique_view)) == true) {
              halfYearArray[dayIndex].users += 1;
            }
          }
        }
        halfYearArray.reverse();
        graphData = halfYearArray;
        break;
      case "year":
        let monthsInYear = 12;
        function sortMonthsInYear() {
          let currentMonth = new Date().getMonth() + 1;
          let list = Array.from({ length: monthsInYear }, (_, i) => {
            i = currentMonth - i;
            if (i > 12) {
              i -= 12;
            }
            if (i < 1) {
              i += 12;
            }
            return i;
          });

          let sortedList = list;

          return sortedList;
        }
        let yearArray = [];
        let sortedyear = await sortMonthsInYear();

        for (let i = 0; sortedyear.length > i; i++) {
          let day = sortedyear[i];
          let dbBit: Point = {
            timeUnit: monthNames[day - 1],
            count: 0,
            users: 0,
            carbon: 0,
          };
          yearArray.push(dbBit);
        }

        for (let i = 0; views.length > i; i++) {
          let view = views[i];
          let currentMonth = new Date().getMonth() + 1;
          let list = Array.from({ length: monthsInYear }, (_, i) => {
            i = currentMonth - i;
            if (i > 12) {
              i -= 12;
            }
            if (i < 1) {
              i += 12;
            }
            return i;
          });

          let day = new Date(view.date).getMonth() + 1;
          let dayIndex = sortedyear.indexOf(day);
          let carbon = await getUserCarbon(view);
          yearArray[dayIndex].carbon += Number(Number(carbon).toFixed(2));
          yearArray[dayIndex].count += 1;
          if (new Boolean(Number(view.unique_view)) == true) {
            yearArray[dayIndex].users += 1;
          }
        }
        yearArray.reverse();
        graphData = yearArray;
        break;
      default:
        break;
    }
  }
  await sortData();
  if (graphData.length > 0) {
    for (let i = 0; graphData.length > i; i++) {
      let dat = graphData[i];
      carbonArr.push(dat.carbon);
      userArr.push(dat.users);
      visitArr.push(dat.count);
      labels.push(dat.timeUnit);
    }
  }
    let data_prep = {
      carbonArr,
      userArr,
      visitArr,
      labels,
    };
    // convert object to buffer
    let returnData = objectToBuffer(data_prep);
    postMessage(returnData);
};
export {};
