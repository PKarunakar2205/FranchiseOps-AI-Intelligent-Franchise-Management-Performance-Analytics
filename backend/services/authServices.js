const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(data) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            full_name: data.full_name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            phone: data.phone,
        },
    });

    return user;
}

async function loginUser(email, password) {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid Email");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Invalid Password");
    }

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        }
    );

    return {
        token,
        user: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            phone: user.phone,
        },
    };
}

async function updateUserProfile(userId, data) {
    const updateData = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.profile_image !== undefined) updateData.profile_image = data.profile_image;

    const user = await prisma.user.update({
        where: { user_id: Number(userId) },
        data: updateData,
    });

    return {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    };
}

async function changeUserPassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
        where: { user_id: Number(userId) },
    });

    if (!user) {
        throw new Error("User account not found");
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        throw new Error("Current password entered is incorrect");
    }

    if (!newPassword || newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { user_id: Number(userId) },
        data: { password: newHashedPassword },
    });

    return { success: true, message: "Password updated successfully" };
}

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    changeUserPassword,
};