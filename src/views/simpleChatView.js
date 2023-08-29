

const getSimpleChat = async (req,res)=>{

    res.sendFile(__dirname+'/simpleChat.html')

}


module.exports = {
    getSimpleChat
}