"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_service_1 = require("../services/database.service");
exports.usersRouter = express_1.default.Router();
exports.usersRouter.use(express_1.default.json());
console.log("i made it here first");
exports.usersRouter.post("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      console.log("i made it here");
      const newUser = req.body;
      if (!database_service_1.collections.users) throw new Error();
      const result = yield database_service_1.collections.users.insertOne(
        newUser
      );
      result
        ? res
            .status(201)
            .send(
              `Successfully created a new user with id ${result.insertedId}`
            )
        : res.status(500).send("Failed to create a new user.");
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);
