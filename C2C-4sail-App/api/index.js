const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User.js')
const Item = require('./models/Item.js')
const Wishlist = require('./models/Wishlist.js')
const Message = require('./models/Message.js')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const CookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')
const ws = require('ws')
require('dotenv').config()
const app = express()
const bcryptSalt = bcrypt.genSaltSync(10) // for encrypting password
const jwtSecret = "aakshdakuweh73yr2udh182h8n"

app.use(express.json());
app.use(CookieParser())
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cors({
    credentials: true, 
    origin: "http://localhost:5173"
}))

mongoose.connect(process.env.MONGO_URL)

app.post('/register', async (req,res) => {
    const {name, email, password} = req.body

    try{

    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc)

} catch (e) {
    if (e.code === 11000) { // MongoDB duplicate key error
        if (e.keyPattern && e.keyPattern.email) {
            res.status(422).json({ error: 'Email is already registered' });
        } else if (e.keyPattern && e.keyPattern.name) {
            res.status(422).json({ error: 'Username is already taken' });
        } else {
            res.status(422).json({ error: 'Duplicate field detected' });
        }
    } else {
        res.status(500).json({ error: 'Internal server error' });
    }
}
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await User.findOne({ email });

        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({email:userDoc.email, name: userDoc.name, id:userDoc._id}, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    return res.cookie('token', token).json(userDoc);
                })
                
            } else {
                return res.json('pass does not match :(');
            }
        } else {
            return res.json('not found');
        }
    } catch (e) {
        return res.status(422).json(e);
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id);
            res.json({name, email, _id})
        })
    } else {
        res.json(null)
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true) // essentially removing the cookie
})

app.post('/uploadByLink', async (req,res) => {
     const {link} = req.body
     const newName = 'photo' + Date.now() + '.jpg';
     await imageDownloader.image ({
        url:link,
        dest: __dirname + '/uploads/' +newName,
     });
     res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++){
        const {path, originalname} = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace('uploads\\',''))

    }
    res.json(uploadedFiles);
})


app.post('/items', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, price, details } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err); 
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            await Item.create({
                seller: userData.id,
                title,
                address,
                photos: addedPhotos,
                description,
                price,
                details
            });
            res.status(201).json({ message: "Item created successfully" });
        } catch (error) {
            console.error("Error creating item", error); 
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.get('/user-items', (req, res) => {
    const {token} = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {id} = userData;
        res.json(await Item.find({seller:id}))
    })

})

app.get('/items/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Item.findById(id))
})

app.put('/items', async (req, res) => {
    const { token } = req.cookies;
    const { id, title, address, addedPhotos, description, price, details } = req.body;


    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err); 
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const itemDoc = await Item.findById(id)
            if (userData.id === itemDoc.seller.toString()){
                itemDoc.set({
                    title,
                    address,
                    photos: addedPhotos,
                    description,
                    price,
                    details
                })

                await itemDoc.save()
            }
            
            res.status(201).json({ message: "Item saved successfully" });
        } catch (error) {
            console.error("Error saving item", error); 
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.get('/items', async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        try {
            const items = await Item.find();
            return res.json(items);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            try {
                const items = await Item.find();
                return res.json(items);
            } catch (error) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        try {
            const items = await Item.find({ seller: { $ne: userData.id } });
            return res.json(items);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
});


app.post('/wishlist', async (req, res) => {
    const { token } = req.cookies;
    const { itemId } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err); 
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            let wishlistDoc = await Wishlist.findOne({ user: userData.id });

            if (wishlistDoc) {
                if (!wishlistDoc.items.includes(itemId)) {
                    wishlistDoc.items.push(itemId);
                    await wishlistDoc.save();
                }
            } else {
                // If wishlist doesn't exist, create a new document
                wishlistDoc = new Wishlist({
                    user: userData.id,
                    items: [itemId],
                });
                await wishlistDoc.save();
            }

            res.status(201).json({ message: "Wishlist updated successfully" });
        } catch (error) {
            console.error("Error updating wishlist", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.delete('/wishlist/:itemId', (req, res) => {
    const { token } = req.cookies;
    const { itemId } = req.params;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err);
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            let wishlistDoc = await Wishlist.findOne({ user: userData.id });

            if (wishlistDoc) {
                const itemIndex = wishlistDoc.items.findIndex(item => item.toString() === itemId);
                if (itemIndex > -1) {
                    wishlistDoc.items.splice(itemIndex, 1);
                    await wishlistDoc.save();
                    return res.status(200).json({ message: "Item removed from wishlist" });
                } else {
                    return res.status(404).json({ error: "Item not found in wishlist" });
                }
            } else {
                return res.status(404).json({ error: "Wishlist not found" });
            }
        } catch (error) {
            console.error("Error removing item from wishlist", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});


app.get('/user-wishlist', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err);
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            let wishlistDoc = await Wishlist.findOne({ user: userData.id });

            if (wishlistDoc) {
                const items = await Item.find({ _id: { $in: wishlistDoc.items } });
                
                return res.status(200).json(items);
            } else {
                return res.status(404).json({ error: "Wishlist not found" });
            }
        } catch (error) {
            console.error("Error retrieving wishlist", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});


app.post('/wishlist/check-item', (req, res) => {
    const { token } = req.cookies;
    const { itemID } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err);
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            let wishlistDoc = await Wishlist.findOne({ user: userData.id });

            if (wishlistDoc) {
                const itemExists = wishlistDoc.items.includes(itemID);
                return res.status(200).json({ exists: itemExists });
            } else {
                return res.status(404).json({ error: "Wishlist not found" });
            }
        } catch (error) {
            console.error("Error checking item in wishlist", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.get('/search-items/:search', async (req, res) => {
    const { search } = req.params;
    if (!search) {
        return res.status(400).json({ error: "Input is required" });
    }

    const words = search.split(' ').filter(word => word.length > 0);

    try {
        // Use a regular expression to find posts containing any of the words
        const regex = new RegExp(words.join('|'), 'i');
        const matchingPosts = await Item.find({
            $or: [
                { title: regex },
                { description: regex },
            ]
        });

        res.status(200).json(matchingPosts);
    } catch (error) {
        console.error("Error retrieving posts", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/messages', async (req, res) => {
    const { token } = req.cookies;
    const { recipient, text } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try {
            const message = await Message.create({
                sender: userData.id,
                recipient,
                text
            });
            res.status(201).json(message);
        } catch (error) {
            console.error("Error creating message", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.get('/messages/users', async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            console.error("JWT verification failed", err);
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const sentMessages = await Message.find({ sender: userData.id }).distinct('recipient');
            const receivedMessages = await Message.find({ recipient: userData.id }).distinct('sender');

            const userIds = Array.from(new Set([...sentMessages, ...receivedMessages]));

            const userObjectIds = userIds.map(id => new mongoose.Types.ObjectId(id));
            const users = await User.find({ _id: { $in: userObjectIds } }, 'name');
            const userNames = users.map(user => user.name);

            res.status(200).json(userNames);
        } catch (error) {
            console.error("Error retrieving user IDs and names", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.post('/messages/conversation', async (req, res) => {
    const { token } = req.cookies;
    const { recipient } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const recipientUser = await User.findOne({ name: recipient }, '_id');

            const senderId = userData.id;
            const recipientId = recipientUser._id;

            const messages = await Message.find({
                $or: [
                    { sender: senderId, recipient: recipientId },
                    { sender: recipientId, recipient: senderId }
                ]
            }).sort({ createdAt: 1 }); // Sort messages by creation date

            res.status(200).json(messages);
        } catch (error) {
            console.error("Error retrieving messages", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});



const server = app.listen(4000)

const wss = new ws.WebSocketServer({server})

wss.on('connection', (connection, req) => {
    const cookies = req.headers.cookie;

    if(cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='))
        if(tokenCookieString){
            const token = tokenCookieString.split('=')[1];
            if(token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    const {id, name} = userData;
                    connection.id = id;
                    connection.name = name;
                
                })
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString())
        const {recipient, text} = messageData;

        if (recipient && text){

            const recipientUser = await User.findOne({ name: recipient }, '_id');
            const recipientId = recipientUser._id;

            const messageDoc = await Message.create({
                sender: connection.id,
                recipient: recipientId,
                text 
            });

            [...wss.clients]
            .filter(c => c.id == recipientId)
            .forEach(c => c.send(JSON.stringify({text, sender:connection.id, id: messageDoc._id})))
        }
    });

    console.log([...wss.clients].map(c => ({id:c.id, name:c.name})));

    // online users 
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            [...wss.clients].map(c => ({id:c.id, name:c.name}))
        ))
    })
});