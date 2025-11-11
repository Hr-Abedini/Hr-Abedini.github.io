// نام روزهای هفته و ماه‌ها به فارسی
const weekdays = ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
const persianMonthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];


function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4)
    - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400)
    + gd + g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return [jy, jm, jd];
}



function getJalaliDateParts(dateString) {
  const d = new Date(dateString);
  if (isNaN(d)) return null;

  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const weekday = weekdays[d.getDay()];
  const monthName = persianMonthNames[jm - 1];

  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  return {
    year: jy,
    month: jm,
    monthName: monthName,
    day: jd,
    weekday: weekday,
    hour: hh,
    minute: mm,
    // رشتهٔ آماده
    formatted1: `${weekday} ${jd} ${monthName} ${jy} - ساعت ${hh}:${mm}`,
    formatted2: `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`
  };
}

//--------------------------------------------------------------------------

// function formatted1(el) {
//   const dateStr = el.dataset.date;
//   const parts = getJalaliDateParts(dateStr);
//   if (!parts) return;

//   // اگر لازم بود می‌توانید parts را برای JS دیگر ذخیره کنید
//   // el.dataset.jalaliYear = parts.year;
//   // el.dataset.jalaliMonth = parts.month;
//   // el.dataset.jalaliDay = parts.day;
//   // el.dataset.jalaliWeekday = parts.weekday;
//   // el.dataset.jalaliHour = parts.hour;
//   // el.dataset.jalaliMinute = parts.minute;

//   return `${parts.weekday} ${parts.day} ${parts.monthName} ${parts.year} -  ${parts.hour}:${parts.minute}`
// }

//------------------------------------------------------------------------------
// تبدیل فرمت به تاریخ استاندارد
// 2025-11-11 01:22:33 -1000 HST

function convertTextToStandardDate(dateStr)
{
  dateStr = dateStr.slice(0, 25);
   // حذف offset دوم اضافی
  dateStr = dateStr.replace(/ [+-]\d{4}$/, '');

  // تبدیل فاصله بین تاریخ و زمان به T
  dateStr = dateStr.replace(' ', 'T');

  // اصلاح offset: +0330 → +03:30
  dateStr = dateStr.replace(/([+-]\d{2})(\d{2})$/, '$1:$2').replace(' ','');

  // ساخت شیء Date جاوااسکریپت
  let dateObj = new Date(dateStr);
  // console.log(dateObj);
  // console.log(dateObj.toISOString());
  
  return dateObj
}

// اعمال روی تمام عناصر با کلاس jdate
document.addEventListener("DOMContentLoaded", () => {
  // document.querySelectorAll(".jdate").forEach(el => {

    const meta = document.querySelector("div.post-meta");
    if (!meta) return;
    
    const oldSpan = meta.querySelector("span[title]");

    if (!oldSpan) return;

    // el.textContent = formatted1(el);  
    // oldSpan.replaceWith(el);   
    
    let postDate = oldSpan.getAttribute('title');
    let dateObj= convertTextToStandardDate(postDate)
    const parts = getJalaliDateParts(dateObj);
    if (!parts) return;

    oldSpan.textContent=parts.formatted1;
  // });
});


// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".post-meta").forEach(meta => {
//     const dateStr = meta.querySelector("span[title]")?.getAttribute("title");
//     if (!dateStr) return;

    
//     const parts = getJalaliDateParts(dateStr);
//          if (!parts) return;

//     const text = `${parts.weekday} ${parts.day} ${parts.monthName} ${parts.year} - ${parts.hour}:${parts.minute}`;
//     setJalaliDate(meta, text);
//   });
// });

