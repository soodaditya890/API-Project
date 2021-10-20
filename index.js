require("dotenv").config();

const express = require("express");
const bodyParser =require("body-parser");
const mongoose = require("mongoose")

//Database
const database = require("./database/database")

//Models
const BookModel=require("./database/book")
const AuthorModel=require("./database/author")
const PublicationModel=require("./database/publication")


//Initialise express
const  Bookalaya = express();
Bookalaya.use(bodyParser.urlencoded({extended:true}));   
Bookalaya.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
).then(()=> console.log("connection establish"));



/*
Route                /
Description          get all the book
access               public
parameter            none
method               get 
*/



Bookalaya.get("/",async(req,res) => {
    const getAllBooks=await BookModel.find();
    return res.json(getAllBooks);
});


/*
Route                /is
Description          get specific book on isbn
access               public
parameter            isbn
method               get 
*/


Bookalaya.get("/is/:isbn",async(req,res) => {
    const getSpecificBook =await BookModel.findOne({ISBN:req.params.isbn});
    //null !0=1 , !1=0
    if(!getSpecificBook){
        return res.json({error:`No Book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book:getSpecificBook});
});


/*
Route                /c
Description          get specific book on category
access               public
parameter            category
method               get 
*/

Bookalaya.get("/c/:category",async(req,res) => {
    const getSpecificBook =await BookModel.findOne({category:req.params.category});
    //null !0=1 , !1=0
    if(!getSpecificBook){
        return res.json({error:`No Book found for the category of ${req.params.category}`});
    }

    return res.json({book:getSpecificBook});
});


/*
Route                /l
Description          get specific book on langurage
access               public
parameter            language
method               get 
*/

Bookalaya.get("/l/:languages",async(req,res) => {
    const getSpecificBook =await BookModel.findOne({language:req.params.languages});
    //null !0=1 , !1=0
    if(!getSpecificBook){
        return res.json({error:`No Book found for the language of ${req.params.languages}`});
    }

    return res.json({book:getSpecificBook});
})

/*
Route                /author
Description          get all authors
access               public
parameter            none
method               get 
*/

Bookalaya.get("/author",async(req,res) => {
    const getAllAuthor=await AuthorModel.find();
    return res.json(getAllAuthor);
})

/*
Route                /author
Description          get specific author based on id
access               public
parameter            id
method               get 
*/

Bookalaya.get("/author/:id",async(req,res) => {
    const getSpecificAuthor =await AuthorModel.findOne({id:req.params.id});

    if(!getSpecificAuthor){
        return res.json({error:`No author founds based on ids of ${req.params.id}`})
    }
    return res.json({author:getSpecificAuthor})
})



/*
Route                /author/book
Description          get all authors based on book
access               public
parameter            isbn
method               get 
*/

Bookalaya.get("/author/book/:isbn", async(req,res) => {
    const getSpecificAuthor =await AuthorModel.find({books:req.params.isbn})


    if(!getSpecificAuthor){
        return res.json({error:`No author found for book of ${req.params.isbn}`});
    }
    return res.json({author:getSpecificAuthor})
})


/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

Bookalaya.get("/publications",async(req,res) => {
    const getAllPublication=await PublicationModel.find();
    return res.json(getAllPublication);
  })



/*
Route            /publications
Description      Get specific publication
Access           PUBLIC
Parameter        id
Methods          GET
*/

Bookalaya.get("/publication/:id",async(req,res) => {
    const getSpecificPublication =await PublicationModel.findOne({id:req.params.id})


    if (!getSpecificPublication){
        return res.json({error:`No publication found based on id ${req.params.id}`})
    }
    return res.json({publications:database.publication})
})

/*
Route            /publications/book
Description      Get specific publication based on book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

Bookalaya.get("/publication/book/:isbn",async(req,res) =>{
    const getSpecificPublication = await PublicationModel.findOne({books:req.params.id})



    if (!getSpecificPublication){
        return res.json({error:`No publication found based on book of ${req.params.isbn}`})
    }
    return res.json({publications:database.publication})
})

//POST 

/*
Route                /book/new
Description          add new book
access               public
parameter            none
method               post
*/

Bookalaya.post("/book/new",async(req,res) => {
    const { newBook } =req.body;
    const addNewBook =BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message:"Book was added!!!"
    });
});

/*
Route                /author/new
Description          add new author
access               public
parameter            none
method               post
*/

Bookalaya.post("/author/new",async(req,res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({
        author:addNewAuthor,
        message:"author added!!!"
    });
})

/*
Route                /publication/new
Description          add new publication
access               public
parameter            none
method               post
*/

Bookalaya.post("/publication/new",async(req,res) =>{
    const { newPublication } = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({
        publication:addNewPublication,
        message:"publication added!!"
    });

});


/*
Route                /book/update
Description          update the book title
access               public
parameter            isbn
method               put
*/

Bookalaya.put("/book/update/:isbn",async(req,res) =>{
    const updateBook =await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            title:req.body.bookTitle
        },
        {
            new:true
        }
    );
    return res.json({
        books:updateBook
    })
})


/*******updating new author*******/
/*
Route                /book/author/update
Description          update / add new author
access               public
parameter            isbn
method               put
*/

Bookalaya.put("/book/author/update/:isbn",async(req,res) => {
    //update the book database
    const updatedBook =await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $addToSet:{
                author:req.body.newAuthor
            }
        },
        {
            new:true
        }
    );
    //update the author database
    const updatedAuthor =await AuthorModel.findOneAndUpdate(
        {
            id:req.body.newAuthor
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }
    );
    return res.json({
        books:updatedBook,
        author:updatedAuthor,
        message:"done"
    })
})





/******DELETE*******/

/*
Route                /book/delete
Description          delete a book
access               public
parameter            isbn
method               delete
*/

Bookalaya.delete("/book/delete/:isbn",async(req,res) =>{
    //whichever book that does not match with the isbn just send it to an updatedbookdatabase array
    //and rest will be filtered out

    const updatedBookDatabase=await BookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    );
    return res.json({
        books:updatedBookDatabase
    })

});


/*
Route                /author/delete
Description          delete a author from book 
access               public
parameter            authorid
method               delete
*/

Bookalaya.delete("/author/delete/:authorID",async(req,res) => {
    const updatedBookDatabase =await AuthorModel.findOneAndDelete(
        {
            id:req.params.authorID
        }
    )
    
    database.author=updatedBookDatabase;
    return res.json({author:database.author})
});


/*
Route                /book/delete/author
Description          delete a author from book and vice versa
access               public
parameter            isbn,authorid
method               delete
*/

Bookalaya.delete("/book/delete/author/:isbn/:authorID",(req,res) => {
    //update the book database
    database.books.forEach((book) =>{
        if (book.ISBN === req.params.isbn){
            const newAuthorList =book.author.filter(
                (eachAuthor) => eachAuthor!==parseInt(req.params.authorID)
            );
            book.author=newAuthorList;
            return;
        }
    });
    //update the author database 
    database.author.forEach((eachAuthor) =>{
        if(eachAuthor.id===parseInt(req.params.authorID)){
            const newBookList =eachAuthor.books.filter(
                (book) => book!==req.params.isbn
            );
                eachAuthor.books=newBookList;
                return;
        }
    });
    return res.json({
        book:database.books,
        author:database.author,
        message:"author was deleted!!!!"
    })
});


Bookalaya.listen(3000,() => {
    console.log("server is up and running");
});