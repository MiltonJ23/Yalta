const router = require('express').Router();
const pool = require('../../database/db');
const authorization = require('../middleware/authorization');

// Let's start with the dashboard route
router.get('/applicant', authorization,async(req,res)=>{

    try {
       // res.json(req.user);
       const applicant = await pool.query('SELECT * FROM applicants_personnals WHERE appid = $1', [req.user]);
       res.json(applicant.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Unfortunately we are encoutering a server error");
    }
});

router.get('/admin', authorization,async(req,res)=>{
    
    try {
        //res.json(req.user);
        const adminstaff = await  pool.query('SELECT * FROM admin_staff WHERE adminid = $1', [req.user]);
         res.json(adminstaff.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Unfortunately we are encoutering a server error");
    }
});



module.exports = router;