import mongoose from 'mongoose';

const ExampleSchema = new mongoose.Schema({
    key_1: {
        type: String,
        required: true,
        unique: true
    },
    key_2: String,
    key_3: Boolean
});

const Example = mongoose.model('Example', ExampleSchema);

export { ExampleSchema, Example }