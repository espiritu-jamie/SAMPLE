const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: mongoose.Schema.Types.Mixed,
    isRead: {
        type: Boolean,
        default: false,
    },
    readBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now }
    }],
    dismissedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        dismissedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
