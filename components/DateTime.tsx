import React, { useEffect, useState } from "react";
interface DateTimeDisplayProps {
  formatOptions?: Intl.DateTimeFormatOptions;
  customDate?: string;
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({ formatOptions, customDate }) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = customDate ? new Date(customDate) : new Date();
      // Provide default options if none are provided through props
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      };
      const options = formatOptions || defaultOptions;
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setCurrentDateTime(formatter.format(now));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [formatOptions]); // Add formatOptions as a dependency

  return <>{currentDateTime}</>;
};

export default DateTimeDisplay;
