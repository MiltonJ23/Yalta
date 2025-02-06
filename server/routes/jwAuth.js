const router = require('express').Router();
const pool = require('../../database/db');
const bcrypt = require('../../server/node_modules/bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorize = require('../middleware/authorization');

// Let's start with the register route

router.post('/applicant/register',validInfo, async(req,res)=>{
    try {
       
        // 1. Destructure the req.body (name, email, password)
        const { name ,email , password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json("Name, email, and password are required");
          }
        //console.log('La verification des champs est ok ');

        // 2. Check if user exists (if user exists then throw error)

        const applicant = await pool.query("SELECT * FROM applicants_personnals WHERE applicantemail = $1", [email]);

       // console.log('La verification de l\'existence de l\'utilisateur est ok , le probleme est ailleurs');
        
        if (applicant.rows.length > 0) {
            return res.status(401).json("User already exists");
          }

        // 3. Bcrypt the user password
          const saltRound = 12;
          const salt = await bcrypt.genSalt(saltRound);

          const hashedPassword = await bcrypt.hash(password,salt);


          // 4. Let's store the user into the database
          const newApplicant = await pool.query('INSERT INTO applicants_personnals (applicantname,applicantemail,applicantpassword,applicantplainpassword) values ($1,$2,$3,$4) RETURNING *', [name,email,hashedPassword,password]);

          // 5. Generating our jwt token
         return  token = jwtGenerator(newApplicant.rows[0].appid);


            
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Unfortunaltely you were unable to register due to an error !!!!");
    }
} );

// Let's start with the login route 

router.post('/applicant/login',validInfo, async(req,res)=>{
    try {
        // 1. destructure the body 
        const {email,password} = req.body;
        // 2. after that we are going to check if the user exists

        
        
        const applicant = await pool.query("SELECT * FROM applicants_personnals WHERE applicantemail = $1", [email]);
       // console.log('we succesfully retrieved the applicant from the database');
        
       if (applicant.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect in this one ");
          }
        // 3. check if the incoming password is the same as the database password
        const validPassword = await bcrypt.compare(password,applicant.rows[0].applicantpassword);

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect , i mean for real");
          }

       
        // 4. give them the jwt token
        // 5. Generating our jwt token  
        const token = jwtGenerator(applicant.rows[0].appid);
        res.json({token});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Unfortunaltely you weren't able to login an error !!!!");
    }


});



// let's build the routes that will allow the administration staff to register and login 

router.post('/adminStaff/register',validInfo, async(req,res)=>{
    
    const { name ,email , password, StaffPass } = req.body;    
        // let's check if the staff pass is correct
        if(StaffPass !== '$2a$06$EBWRR7hYaPcNT1MqEO2FxeYVlJWhZTBYTx6aNFJfW2XmIFgdcD1q.'){
            return res.status(401).json("You are not an Admission Staff");
        }else{
           // console.log('You are an Admission Staff, the problem lies elsewhere');
            try {   
                
                if (!name || !email || !password) {
                    return res.status(400).json("Name, email, and password are required");
                  }
                //console.log('La verification des champs est ok ');
        
                // 2. Check if user exists (if user exists then throw error)
        
                const adminStaff = await pool.query("SELECT * FROM AdmissionStaff WHERE staffemail = $1", [email]);
        
               // console.log('La verification de l\'existence de l\'utilisateur est ok , le probleme est ailleurs');
                
                if (adminStaff.rows.length > 0) {
                    return res.status(401).json("Staff member already exists");
                  }
        
                // 3. Bcrypt the user password
                  const saltRound = 12;
                  const salt = await bcrypt.genSalt(saltRound);
        
                  const hashedPassword = await bcrypt.hash(password,salt);
        
        
                  // 4. Let's store the user into the database
                  const newAdminStaff = await pool.query('INSERT INTO AdmissionStaff (staffname,staffemail,staffpassword,staffplainpassword) values ($1,$2,$3,$4) RETURNING *', [name,email,hashedPassword,password]);
        
                  // 5. Generating our jwt token
                  const token = jwtGenerator(newAdminStaff.rows[0].staffid);
        
                    
                
            } catch (error) {
                console.log(error.message);
                res.status(500).send("Unfortunaltely you were unable to register due to an error !!!!");
            }
        }
        
    
} );

// let's now create the login route for the Admission Staff

router.post('/adminStaff/login',validInfo, async(req,res)=>{
    const {email,password,StaffPass} = req.body;
    // let's check if the staff pass is correct 
    if(StaffPass !== '$2a$06$EBWRR7hYaPcNT1MqEO2FxeYVlJWhZTBYTx6aNFJfW2XmIFgdcD1q.'){
        return res.status(401).json("You are not an Admission Staff");
    }else{
        try {

            // 2. after that we are going to check if the user exist 
            const adminStaff = await pool.query("SELECT * FROM AdmissionStaff WHERE staffemail = $1", [email]);
           // console.log('we succesfully retrieved the applicant from the database');
            
           if (adminStaff.rows.length === 0) {
                return res.status(401).json("Password or Email is incorrect in this one ");
              }
            // 3. check if the incoming password is the same as the database password
            const validPassword = await bcrypt.compare(password,adminStaff.rows[0].staffpassword);
    
            if (!validPassword) {
                return res.status(401).json("Password or Email is incorrect , i mean for real");
              }
    
           
            // 4. give them the jwt token
            // 5. Generating our jwt token  
            const token = jwtGenerator(adminStaff.rows[0].staffid);
            res.json({token});
    
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Unfortunaltely you weren't able to login an error !!!!");
        }
    }
        
    
});

router.get('/verify',authorize, async(req,res)=>{
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// the route to get all the programs that are available to the applicant
router.get('/applicant/programs',authorize, async(req,res)=>{

    try {
        const user = await pool.query("SELECT * FROM programs ");
        res.json(user.rows);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// the route to create a new admissions application
router.post('/applicant/admissions',authorize, async(req,res)=>{
   // first of all let's verify if the applicant already apply for a program 
    try {
     const {code,appid} = req.body;

     console.log("The problem does not lies at the destructuration of the body");
    
     const application = await pool.query("SELECT * FROM admissions WHERE appid = $1 ", [appid]);
     
     console.log("The problem does not lies at the  query to verify if the applicant already apply for a program");
     
     if (application.rows.length > 0) {
          return res.status(401).json("You already applied for a program, you can't apply for another one");
        }
     
        const newApplication = await pool.query('INSERT INTO admissions (appid,code,applicationdate) values ($1,$2,NOW()) RETURNING *', [appid,code]);
     
        console.log("The problem does not lies at the insertion of the new application");
    
        const newNotification = await pool.query('INSERT INTO notifications (appid,code,notificationstamp) values ($1,$2,NOW()) RETURNING *', [appid,code]);
     
     
        res.json(newApplication.rows[0]);
    } catch (error) {
     console.error(error.message);
     res.status(500).send("Server Error");
    }
});


// the route to get the notifications of the applicant
router.post('/applicant/Allnotifications',authorize, async(req,res)=>{
    try {
        const {appid} = req.body;
        const user = await pool.query("SELECT * FROM notifications WHERE appid = $1 ", [appid]);
        
        return res.json(user.rows);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// the route to retrieve a particular notification 
router.post('/applicant/notification', authorize, async (req, res) => {
    try {
      const { appid, notifid } = req.body;
      const result = await pool.query(
        "UPDATE notifications SET notificationstatus = true WHERE appid = $1 AND notifid = $2 RETURNING *",
        [appid, notifid]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

// let's create the route to update the status of an admission and then generate a notification
router.put('/adminStaff/admissions/status', authorize, async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const { appid, code, admissionstatus, notificationmessage } = req.body;
  
      // 1. Validate input
      if (!appid || !code || !admissionstatus) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // 2. Update admission status
      const updateQuery = `
        UPDATE admissions 
        SET admissionstatus = $1 
        WHERE appid = $2 AND code = $3 
        RETURNING *`;
        
      const updateResult = await client.query(updateQuery, [
        admissionstatus,
        appid,
        code
      ]);
  
      if (updateResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: "Admission record not found" });
      }
  
      // 3. Create notification
      const notificationQuery = `
        INSERT INTO notifications 
          (appid, code, notificationstamp, notificationmessage) 
        VALUES ($1, $2, NOW(), $3) 
        RETURNING *`;
      
      const notificationResult = await client.query(notificationQuery, [
        appid,
        code,
        notificationmessage || 'Status updated' // Default message
      ]);
  
      await client.query('COMMIT');
      
      res.json({
        success: true,
        admission: updateResult.rows[0],
        notification: notificationResult.rows[0]
      });
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error.message);
      res.status(500).json({ 
        error: "Database transaction failed",
        details: error.message
      });
    } finally {
      client.release();
    }
  });

// let's create a route to retrieve all the informations about an admission 
router.post('/applicant/informationAdmission' ,authorize, async(req,res) =>{
    const { appid } = req.body;   
    //let's fetch the admissions data in the databse 
    try {
        const admission = await pool.query("SELECT * FROM admissions WHERE appid = $1 ", [appid]);
        res.json(admission.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");      
    }
});

router.get('/adminStaff/applicants', authorize, async (req, res) => {
    try {
      const applicants = await pool.query(`
        SELECT a.*, ad.admissionstatus, ad.applicationdate 
        FROM applicants_personnals a
        LEFT JOIN admissions ad ON a.appid = ad.appid
      `);
      res.json(applicants.rows);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  });


  router.get('/adminStaff/admissions', authorize, async (req, res) => {
    try {
        console.log("it happen to reach here ");
      const admission = await pool.query(`
        SELECT 
          a.AppId, 
          a.Code, 
          a.ApplicationDate, 
          a.AdmissionStatus, 
          ap.ApplicantName, 
          ap.ApplicantEmail, 
          p.ProgramName, 
          p.ProgramDepartment
        FROM 
          Admissions a 
        JOIN 
          Applicants_Personnals ap 
        ON 
          a.AppId = ap.AppId
        JOIN 
          Programs p 
        ON 
          a.Code = p.Code
        ORDER BY 
          a.ApplicationDate DESC;
      `);
      console.log("it happen to reach here 2");
      res.json(admission.rows);
    } catch (err) {
      res.status(500).send("Unable to work with the server , meaning server error ");
    }
  });

module.exports = router;