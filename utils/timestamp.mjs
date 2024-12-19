const timestamp = {
    getCurrentTime: function getCurrentTime() {
        const timestamp = Date.now();
        const options = {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        }
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(timestamp);
        return formattedDate;
    }
}

export default timestamp;
