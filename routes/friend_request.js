const {Router} = require('express');
const { get } = require('http');

const router = Router();

class FriendRequest{
    constructor(user){
        this.user=user;
        this.#getFriendRequests(user)
        .then((val) =>{
            this.friendRequests=val.friendRequests;
        })
        .catch((err) =>{
            console.log(err);
        });
    }

    #getFriendRequests(user){
        return new Promise((resolve, reject) => {
            if(user===""){
                return reject(`Please fill all the fields`);
            }
            resolve({mssg:'Friend Requests fetched successfully',
                friendRequests:[]
            });
        });
    }

    requestResponse(friendId, response){
        if(friendId in this.friendRequests){
            if(response==="accept"){
                console.log("Friend request accepted");
            }
            else{
                console.log("Friend request rejected");
            }
            delete this.friendRequests[friendId];
        }
    }
}