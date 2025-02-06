module.exports =  (req,res,next) =>{
    const {name,email,password} = req.body;
    
    function validEmail(userEmail){
        return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(userEmail);
    }
    if(req.path === "/applicant/register"){
        if(![name,email,password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }else if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }
    }else if(req.path === "/applicant/login"){
        if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }else if(![email,password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }
    }else if(req.path === "/adminStaff/register"){
        if(![name,email,password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }else if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        } 
    }else if(req.path === "/adminStaff/login"){ 
        if(!validEmail(email)){
            return res.status(401).json("Invalid Email");
        }else if(![email,password].every(Boolean)){
            return res.status(401).json("Missing Credentials");
        }
    }
    next();
}