import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        identifier: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        contentType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContentType",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;