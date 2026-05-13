"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Poll_1 = require("../src/models/Poll");
var Question_1 = require("../src/models/Question");
var QuestionOption_1 = require("../src/models/QuestionOption");
var Response_1 = require("../src/models/Response");
var PollView_1 = require("../src/models/PollView");
var dotenv = require("dotenv");
var url_1 = require("url");
var path_1 = require("path");
var env_1 = require("../src/config/env");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
dotenv.config({ path: (0, path_1.resolve)(__dirname, "../.env") });
var MONGODB_URI = env_1.env.MONGODB_URI || "mongodb://localhost:27017/pulseloop";
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var poll, questions, optionsByQuestion, _i, questions_1, q, _a, _b, browsers, osList, devices, viewsCount, i, responseCount, i, browser, os, device, createdAt, voterId, fingerprint, _c, questions_2, q, options, option, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 19, , 20]);
                    return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI)];
                case 1:
                    _d.sent();
                    console.log("Connected to MongoDB");
                    return [4 /*yield*/, Poll_1.default.findOne().sort({ createdAt: -1 })];
                case 2:
                    poll = _d.sent();
                    if (!poll) {
                        console.log("No polls found to seed");
                        process.exit(0);
                    }
                    console.log("Seeding data for poll: ".concat(poll.title, " (").concat(poll._id, ")"));
                    return [4 /*yield*/, Question_1.default.find({ pollId: poll._id })];
                case 3:
                    questions = _d.sent();
                    optionsByQuestion = {};
                    _i = 0, questions_1 = questions;
                    _d.label = 4;
                case 4:
                    if (!(_i < questions_1.length)) return [3 /*break*/, 7];
                    q = questions_1[_i];
                    _a = optionsByQuestion;
                    _b = q._id.toString();
                    return [4 /*yield*/, QuestionOption_1.default.find({ questionId: q._id })];
                case 5:
                    _a[_b] = _d.sent();
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    browsers = ["Chrome", "Safari", "Firefox", "Edge", "Mobile Safari"];
                    osList = ["Windows", "MacOS", "iOS", "Android", "Linux"];
                    devices = ["Desktop", "Mobile", "Tablet"];
                    // 1. Seed Views
                    console.log("Seeding views...");
                    viewsCount = 150 + Math.floor(Math.random() * 100);
                    i = 0;
                    _d.label = 8;
                case 8:
                    if (!(i < viewsCount)) return [3 /*break*/, 11];
                    return [4 /*yield*/, PollView_1.default.create({
                            pollId: poll._id,
                            viewerId: "voter_".concat(Math.random().toString(36).substring(7)),
                            fingerprint: "fp_".concat(Math.random().toString(36).substring(7)),
                            ipAddress: "192.168.1.".concat(Math.floor(Math.random() * 255)),
                            createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
                        })];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11:
                    // 2. Seed Responses
                    console.log("Seeding responses...");
                    responseCount = 80 + Math.floor(Math.random() * 50);
                    i = 0;
                    _d.label = 12;
                case 12:
                    if (!(i < responseCount)) return [3 /*break*/, 17];
                    browser = browsers[Math.floor(Math.random() * browsers.length)];
                    os = osList[Math.floor(Math.random() * osList.length)];
                    device = devices[Math.floor(Math.random() * devices.length)];
                    createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
                    voterId = "voter_".concat(Math.random().toString(36).substring(7));
                    fingerprint = "fp_".concat(Math.random().toString(36).substring(7));
                    _c = 0, questions_2 = questions;
                    _d.label = 13;
                case 13:
                    if (!(_c < questions_2.length)) return [3 /*break*/, 16];
                    q = questions_2[_c];
                    options = optionsByQuestion[q._id.toString()];
                    option = options[Math.floor(Math.random() * options.length)];
                    return [4 /*yield*/, Response_1.default.create({
                            pollId: poll._id,
                            questionId: q._id,
                            selectedOptionId: option._id,
                            isAnonymous: true,
                            fingerprint: fingerprint,
                            voterId: voterId,
                            ipAddress: "192.168.1.".concat(Math.floor(Math.random() * 255)),
                            deviceInfo: {
                                browser: browser,
                                os: os,
                                device: device,
                                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                screenResolution: "1920x1080",
                                language: "en-US"
                            },
                            timeTaken: 10 + Math.floor(Math.random() * 20),
                            createdAt: createdAt
                        })];
                case 14:
                    _d.sent();
                    _d.label = 15;
                case 15:
                    _c++;
                    return [3 /*break*/, 13];
                case 16:
                    i++;
                    return [3 /*break*/, 12];
                case 17:
                    // Update poll view count
                    poll.viewCount = viewsCount;
                    return [4 /*yield*/, poll.save()];
                case 18:
                    _d.sent();
                    console.log("Seeding completed successfully!");
                    process.exit(0);
                    return [3 /*break*/, 20];
                case 19:
                    error_1 = _d.sent();
                    console.error("Seeding failed:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    });
}
seed();
