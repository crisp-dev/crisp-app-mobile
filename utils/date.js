class DateHelper {
  pad(number) {
    const __PAD_LIMIT = 10;

    let padded_number = `${number}`;

    if (isNaN(number)) {
      padded_number = "00";
      throw new Error(`Not a number: ${number}`);
    }

    if (typeof number != "number") {
      number = parseInt(number, 10);
    }

    // This one needs some padding!
    if (number < __PAD_LIMIT) {
      padded_number = `0${number}`;
    }

    return padded_number;
  }

  format(timestamp) {
    const __MILLISECONDS_IN_SECOND = 1000;
    const __SECONDS_GAP = 10;
    const __SECONDS_IN_MINUTE = 60;
    const __SECONDS_IN_HOUR = 3600;
    const __SECONDS_IN_DAY = 86400;

    let gap_seconds,
      time_ago_value = 0,
      time_ago_formatted = null;

    // Grab the gap between now and then
    let current_date = new Date(),
      compare_date = new Date(timestamp);

    gap_seconds = current_date.getTime() - compare_date.getTime();
    gap_seconds = Math.round(
      gap_seconds / __MILLISECONDS_IN_SECOND
    );

    if (gap_seconds < __SECONDS_GAP) {
      // It just happened.
      time_ago_value = gap_seconds;
      time_ago_formatted = "Just now";
    } else if (gap_seconds < __SECONDS_IN_MINUTE) {
      // A few seconds ago.
      time_ago_value = gap_seconds;
      time_ago_formatted = "A few seconds ago";
    } else if (gap_seconds < __SECONDS_IN_HOUR) {
      // A few minutes ago.
      time_ago_value = Math.floor(gap_seconds / __SECONDS_IN_MINUTE);

      if (time_ago_value === 1) {
        time_ago_formatted = "A minute ago";
      } else {
        time_ago_formatted = `${time_ago_value} minutes ago`;
      }
    } else if (gap_seconds < __SECONDS_IN_DAY) {
      // A few hours ago.
      time_ago_value = Math.floor(gap_seconds / __SECONDS_IN_HOUR);

      if (time_ago_value === 1) {
        time_ago_formatted = "An hour ago";
      } else {
        time_ago_formatted = `${time_ago_value} hours ago`;
      }
    } else {
      // It"s been a long time since then.
      time_ago_value = gap_seconds;
      time_ago_formatted = [`${this.pad(compare_date.getDate())}`,
        `/${this.pad(compare_date.getMonth() + 1)}`,
        `/${compare_date.getFullYear()}`
      ].join("");
    }

    return time_ago_formatted;
  }
}

export default new DateHelper();
