String.prototype.shorten = function (_String, _Max) {
    if (_String.length > _Max) {
        return _String.substr(0, _Max - 3) + "...";
    } else {
        return _String;
    }
}