var Filters;
(function (Filters) {
    var forPhone = (function () {
        function forPhone() {
            this.filter = function (phone) {
                ///*
                //@param {Number | String } number - Number that will be formatted as telephone number
                //Returns formatted number: (###) ###-####
                //if number.length < 4: ###
                //    umber.length < 7: (###) ###
                //Does not handle country codes that are not '1' (USA)
                ////*/
                //if (!phone) { return ''; }
                //phone = String(phone);
                //// Will return formattedNumber. 
                //// If phonenumber isn't longer than an area code, just show number
                //var formattedNumber = phone;
                //// if the first character is '1', strip it out and add it back
                //var c = (phone[0] == '1') ? '1 ' : '';
                //phone = phone[0] == '1' ? phone.slice(1) : phone;
                //// # (###) ###-#### as c (area) front-end
                //var area = phone.substring(0, 3);
                //var front = phone.substring(3, 6);
                //var end = phone.substring(6, 10);
                //if (front) {
                //    formattedNumber = (c + "(" + area + ") " + front);
                //}
                //if (end) {
                //    formattedNumber += ("-" + end);
                //}
                ////console.log(formattedNumber);
                //return formattedNumber;
                if (!phone) {
                    return '';
                }
                var value = phone.toString().trim().replace(/^\+/, '');
                if (value.match(/[^0-9]/)) {
                    return phone;
                }
                var country, city, number;
                switch (value.length) {
                    case 1:
                    case 2:
                    case 3:
                        city = value;
                        break;
                    default:
                        city = value.slice(0, 3);
                        number = value.slice(3);
                }
                if (number) {
                    if (number.length > 3) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 7);
                    }
                    else {
                        number = number;
                    }
                    return ("(" + city + ") " + number).trim();
                }
                else {
                    return "(" + city;
                }
            };
        }
        return forPhone;
    })();
    Filters.forPhone = forPhone;
})(Filters || (Filters = {}));
//# sourceMappingURL=phoneFilter.js.map