import express from "express";

const registerController = async (req,res) => {
    const body = req.body;
    res.send(body);
}

export {
    registerController
}