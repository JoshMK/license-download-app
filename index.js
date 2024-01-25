var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var fs = require("fs");
var path = require("path");
var fsPromises = require("fs").promises;
var data = require("./example.json"); //can export the SBOM from the dependency graph and put it here
function getLicenseList() {
    var licenseList = [];
    for (var _i = 0, _a = data.packages; _i < _a.length; _i++) {
        var dependency = _a[_i];
        if (dependency.licenseConcluded) {
            licenseList = __spreadArray(__spreadArray([], licenseList, true), [dependency.licenseConcluded], false);
        }
    }
    if (licenseList.length === 0) {
        return "No licenses found.";
    }
    return Array.from(new Set(licenseList.sort(function (a, b) { return (a > b ? 1 : -1); })));
}
function getLicenseListDownloads() {
    var licenses = getLicenseList();
    var uniqueLicenseNames = [];
    //replace all parenthesis + AND/OR
    var filteredLicenses = licenses.map(function (license) {
        return Array.from(new Set(license
            .replace("(", "")
            .replace(")", "")
            .split(" ")
            .filter(function (license) { return license !== "AND" && license !== "OR"; })));
    });
    //add unique entries with extension to list
    filteredLicenses.forEach(function (licenses) {
        for (var i = 0; i < licenses.length; i++) {
            if (!uniqueLicenseNames.includes("".concat(licenses[i], ".txt"))) {
                uniqueLicenseNames = __spreadArray(__spreadArray([], uniqueLicenseNames, true), [
                    "".concat(licenses[i], ".txt"),
                ], false);
            }
        }
    });
    return uniqueLicenseNames.sort(function (a, b) { return (a > b ? 1 : -1); });
}
var downloadLicenseFiles = function () { return __awaiter(_this, void 0, void 0, function () {
    var licenses, i, licenseName, text, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                licenses = getLicenseListDownloads();
                if (!fs.existsSync("".concat(__dirname, "/licenses"))) {
                    fs.mkdirSync("".concat(__dirname, "/licenses"));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < licenses.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, fetch("https://raw.githubusercontent.com/spdx/license-list-data/main/text/".concat(licenses[i]))];
            case 3:
                licenseName = _a.sent();
                return [4 /*yield*/, licenseName.text()];
            case 4:
                text = _a.sent();
                return [4 /*yield*/, fsPromises.writeFile(path.join("".concat(__dirname, "/licenses"), licenses[i]), text)];
            case 5:
                _a.sent();
                console.log("license for ".concat(licenses[i], " (").concat(i + 1, " of ").concat(licenses.length, ") written."));
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 2];
            case 7:
                console.log("Done!");
                return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
downloadLicenseFiles();
