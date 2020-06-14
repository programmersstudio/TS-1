"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CartSchema = new mongoose_1.default.Schema({
    itemList: [
        {
            itemId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Store',
                required: true
            }
        }
    ],
    forUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
exports.cartSchema = mongoose_1.default.model('Cart', CartSchema);
// module.exports = mongoose.model('Cart', CartSchema);
