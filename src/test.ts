import { db } from "./server/db";


await db.user.create({
    data: { 
        emailAddress:'rai3587@gmail.com',
        firstName:'Adityaa',
        lastName:'Rai', 

    }
    
})
console.log("done")