Date.prototype.toUTCyyyyMMdd = function () {

    var yyyy = this.getUTCFullYear().toString();
    var mm = (this.getUTCMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getUTCDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding

}