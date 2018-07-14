const mongoose = require('mongoose');
const mongooseCurrency = require('mongoose-currency');

mongooseCurrency.loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: '',
    },
    price: {
        type: Currency,
        min: 0,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;
