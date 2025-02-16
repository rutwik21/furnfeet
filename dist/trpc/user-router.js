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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const get_payload_1 = require("../get-payload");
const address_validator_1 = require("../lib/validators/address-validator");
exports.userRouter = (0, trpc_1.router)({
    addNewAddress: trpc_1.privateProcedure
        .input(address_validator_1.NewAddressValidator)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const { user } = ctx;
        let { name, contact, addressLine1, addressLine2, city, state, pinCode } = input;
        if (input.name == "" || input.addressLine1 == "" || input.city == "" || input.state == "" || input.pinCode == "" || input.contact.toString().length != 10) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
        }
        try {
            const payload = yield (0, get_payload_1.getPayloadClient)();
            yield payload.update({
                user: user,
                collection: 'addresses',
                data: { isDefaultAddress: false },
                where: {
                    user: {
                        equals: user.id
                    }
                }
            });
            contact = Number(contact);
            yield payload.create({
                user: user,
                collection: 'addresses',
                data: {
                    name: name,
                    contact: contact,
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    city: city,
                    state: state,
                    pinCode: pinCode,
                    isDefaultAddress: true
                }
            });
            const { docs: addresses } = yield payload.find({
                collection: 'addresses',
                where: {
                    user: {
                        equals: user.id,
                    },
                },
            });
            return addresses;
        }
        catch (err) {
            console.log(err);
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
    })),
    updateAddress: trpc_1.privateProcedure
        .input(address_validator_1.UpdateAddressValidator)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const { user } = ctx;
        let { id, name, contact, addressLine1, addressLine2, city, state, pinCode, isDefaultAddress } = input;
        if (input.id == "", input.name == "" || input.addressLine1 == "" || input.city == "" || input.state == "" || input.pinCode == "" || input.contact.toString().length != 10) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST' });
        }
        try {
            const payload = yield (0, get_payload_1.getPayloadClient)();
            if (isDefaultAddress == true) {
                yield payload.update({
                    user: user,
                    collection: 'addresses',
                    data: { isDefaultAddress: false },
                    where: {
                        user: {
                            equals: user.id
                        }
                    }
                });
            }
            contact = Number(contact);
            yield payload.update({
                user: user,
                collection: 'addresses',
                data: {
                    name: name,
                    contact: contact,
                    addressLine1: addressLine1,
                    addressLine2: addressLine2 ? addressLine2 : "",
                    city: city,
                    state: state,
                    pinCode: pinCode,
                    isDefaultAddress: isDefaultAddress
                },
                where: {
                    id: {
                        equals: id
                    },
                }
            });
            const { docs: addresses } = yield payload.find({
                collection: 'addresses',
                where: {
                    user: {
                        equals: user.id,
                    },
                },
            });
            return addresses;
        }
        catch (err) {
            console.log(err);
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
    })),
    allAddresses: trpc_1.privateProcedure
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        const { user } = ctx;
        try {
            const payload = yield (0, get_payload_1.getPayloadClient)();
            const { docs: addresses } = yield payload.find({
                collection: 'addresses',
                where: {
                    user: {
                        equals: user.id,
                    },
                },
            });
            return addresses;
        }
        catch (err) {
            console.log(err);
            throw new server_1.TRPCError({ code: 'NOT_FOUND' });
        }
    })),
});
