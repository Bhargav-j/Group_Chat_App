export function formatDateTime(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();
  
    // Check if the date is today
    const isToday = date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();
  
    if (isToday) {
      // Format time as HH:mm (24-hour format)
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      // Format date as MM/DD/YYYY
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
  
//   const dateString = "2024-05-10T06:22:53.337Z";
//   const formattedDateTime = formatDateTime(dateString);
//   console.log(formattedDateTime); // Output: "12/12/2024" or "12:30" based on the date
  