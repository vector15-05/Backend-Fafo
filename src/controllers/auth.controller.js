import express from "express";
import { prisma } from "../config/db.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";

const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists with this email" })
    }

    // Hash Password

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt);

    const token = generateToken(user.id, res);


    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        token
    });

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    })
}

const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({ "error": "Invalid email/password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({ "error": "Invalid email/password" })
    }

    // Generate JWT token

    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
            token,
        }
    })
}

const logoutController = (req, res) => {
    
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0), // expired at current time
    });
    
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
}

export {
    registerController,
    loginController,
    logoutController
}