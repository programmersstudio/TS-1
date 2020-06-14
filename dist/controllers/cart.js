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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const helpers_1 = require("../helpers/helpers");
const constants_1 = require("../helpers/constants");
const cart_1 = require("../models/cart");
class CartController {
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield helpers_1.getJwtPayload(req.header('auth-token'));
                // const cart = await cartSchema.find({ forUser: userId });
                const cart = yield cart_1.cartSchema.find({ forUser: userId }).populate('forUser', 'itemList.itemId');
                return res.status(constants_1.STATUS_CODE_SUCCESS).send(cart);
            }
            catch (error) {
                console.error(error);
                return res.status(constants_1.STATUS_CODE_ERROR).send(error.message);
            }
        });
    }
    cartOpearations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                operation: joi_1.default
                    .string()
                    .uppercase()
                    .required(),
                productId: joi_1.default
                    .string()
                    .required()
            });
            try {
                const validate = yield schema.validate(req.body);
                if (validate.error != null) {
                    return res.status(constants_1.STATUS_CODE_ERROR).send(validate.error.details[0].message);
                }
                const userId = yield helpers_1.getJwtPayload(req.header('auth-token'));
                if (req.body.operation === 'ADD') {
                    const item = { "itemId": req.body.productId };
                    const updatedCart = yield cart_1.cartSchema.findOneAndUpdate({ forUser: userId }, { $push: { itemList: { itemId: req.body.productId } } }, { new: true }).populate('forUser', 'itemList.itemId');
                    return res.status(constants_1.STATUS_CODE_SUCCESS).send(updatedCart);
                }
                else if (req.body.operation === 'SUB') {
                    const item = { "itemId": req.body.productId };
                    const updatedCart = yield cart_1.cartSchema.findOneAndUpdate({ forUser: userId }, { $pull: { itemList: item } }, { new: true }).populate('forUser', 'itemList.itemId');
                    return res.status(constants_1.STATUS_CODE_SUCCESS).send(updatedCart);
                }
                else {
                    return res.status(constants_1.STATUS_CODE_ERROR).send('Invalid operation!');
                }
            }
            catch (error) {
                console.error(error);
                return res.status(constants_1.STATUS_CODE_ERROR).send(error.message);
            }
        });
    }
}
exports.CartController = CartController;
