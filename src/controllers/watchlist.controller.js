import express from "express";
import { prisma } from "../config/db.js";

const addToWatchlist = async(req,res) => {
    const {movieId, status, notes, rating, userId} = req.body;

    //verify movie exists

    const movie = await prisma.movie.findUnique({
        where: {id : movieId}
    });

    if(!movie){
        return res.status(404).json({"error": "movie not found"});
    }


    const existingInWatchList = await prisma.watchlistItem.findUnique({
        where: {userId_movieId : {
            userId: userId,
            movieId: movieId,
        }},
    });

    if(existingInWatchList){
        return res.status(400).json({error:"Movie already in watchlist"})
    }

    const watchListItem = await prisma.watchlistItem.create({
        data: {
            userId,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        }
    });

    res.status(201).json({"success":"Added to watchlist",data:{
        watchlistItem
    }})

}

export {
    addToWatchlist
}