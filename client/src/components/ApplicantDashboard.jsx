import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ApplicantDashboard.css";

const ApplicantDashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [appid, setAppid] = useState(""); // Define appid state
  const [activeTab, setActiveTab] = useState("application");
  const [programs, setPrograms] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [admissions, setAdmissions] = useState([]);

  // Logout function defined first
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out successfully");
  };

  // Profile fetching
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/applicant", {
        headers: { token: localStorage.token }
      });
      const data = await res.json();
      setAppid(data.appid || ""); // Handle potential undefined
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err.message);
    }
  };

  // Programs fetching with department grouping
  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/applicant/programs", {
        method: "GET",
        headers: { token: localStorage.token }
      });
      const data = await res.json();
      
      const grouped = data.reduce((acc, program) => {
        const dept = program.programdepartment;
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(program);
        return acc;
      }, {});

      setPrograms(grouped);
    } catch (err) {
      toast.error("Failed to load programs");
      console.error(err.message);
    }
  };

  // Notifications fetching
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/applicant/allnotifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: localStorage.token },
        body: JSON.stringify({appid })
      });
      //console.log("At least it enters this function at step 1 ");
      if (!response.ok) {
       // console.log("At least it enters this function at step 2 ");
        if (response.status === 403) {
        //  console.log("At least it enters this function at step 3 ");
          toast.error("Session expired - please login again");
          logout();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications');
      }
      
    //  console.log("At least it enters this function at step 4 ");
      const data = await response.json();
  
      setNotifications(prev => {
      //  console.log("At least it enters this function at step 5 ");
        const updatedNotifications = data.map(notif => ({
          ...notif,
          notificationstamp: new Date(notif.notificationstamp)
        }));
        //console.log("At least it enters this function at step 6 ");
        // Detect new notifications after update
        const newNotifications = updatedNotifications.filter(newNotif => 
          !prev.some(existingNotif => existingNotif.notifid === newNotif.notifid)
        );
      //  console.log("At least it enters this function at step 7 ");
        newNotifications.forEach(notif => {
          toast.info(`New update: ${notif.notificationmessage}`);
        });
      //  console.log("At least it enters this function at step 8 ");
        return updatedNotifications;
      });
      
    } catch (err) {
     // console.log("At least it enters this function at step 9 ");
      toast.error(err.message);
      console.error(err);
    }
  };

  const handleApply = async (code) => {
    try {
      const response = await fetch("http://localhost:3000/auth/applicant/admissions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "token": localStorage.token
        },
        body: JSON.stringify({ code, appid })
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        // Handle duplicate application error from server
        if (response.status === 409) {
          toast.error(result.message || "Already applied to this program");
        } else {
          throw new Error(result.message || "Application failed cannot apply twice");
        }
        return;
      }
  
      toast.success("Application submitted successfully!");
      fetchNotifications();
  
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };
  // Add new fetch function
const fetchAdmissions = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth/applicant/informationAdmission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.token
      },
      body: JSON.stringify({ appid })
    });

    if (!response.ok) throw new Error('Failed to fetch admissions');
    
    const data = await response.json();
    setAdmissions(data.map(admission => ({
      ...admission,
      applicationdate: new Date(admission.applicationdate)
    })));
  } catch (err) {
    toast.error(err.message);
    console.error(err);
  }
};

  // Notification click handler
  const handleNotificationClick = async (notifid) => {
    try {
      await fetch("http://localhost:3000/auth/applicant/notification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
         "token": localStorage.token
        },
        body: JSON.stringify({ appid,notifid})
      });

      setExpandedNotification(prev => prev === notifid ? null : notifid);
      setNotifications(prev => prev.map(n => 
        n.notifid === notifid ? { ...n, notificationstatus: true } : n
      ));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    if (activeTab === "application") fetchPrograms();
    if (activeTab === "notifications") fetchNotifications();
    if (activeTab === "applied") fetchAdmissions(); // Add this line
  }, [activeTab, appid]);

  return (
    <div className="dashboard-container">
      {/* Dark Sidebar */}
      <div className="dark-sidebar">
        <div className="menu-items">
          <div 
            className={`menu-item ${activeTab === 'application' ? 'active' : ''}`}
            onClick={() => setActiveTab('application')}
          >
            Application
          </div>
          <div 
            className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </div>
        </div>

        {/*Here is the applied panel*/}
        <div className="menu-items">
  {/* Existing items */}
           <div 
    className={`menu-item ${activeTab === 'applied' ? 'active' : ''}`}
    onClick={() => setActiveTab('applied')}
           >
          Applied
             </div>
        </div>

        {/* Profile Section with Logout */}
        <div className="profile-section" onClick={logout}>
        <div className="profile-circle-large">
          {appid ? appid.charAt(0).toUpperCase() : "?"} {/* Handle empty state */}
        </div>
        <div className="profile-id">
          {appid || "Loading..."} {/* Show loading state */}
        </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "application" ? (
          <div className="application-content">
            <h2 className="section-title">Available Programs</h2>
            {Object.entries(programs).map(([department, deptPrograms]) => (
              <div key={department} className="department-group">
                <h3 className="department-title">{department}</h3>
                <div className="programs-list">
                  {deptPrograms.map(program => (
                    <div key={program.code} className="program-card">
                      <div className="program-header">
                        <input
                          type="radio"
                          name="program"
                          value={program.code}
                          onChange={(e) => e.target.checked}
                        />
                        <div className="program-info">
                          <h3>{program.programname}</h3>
                          <p><strong>Code:</strong> {program.code}</p>
                          <p><strong>Duration:</strong> {program.programduration} years</p>
                          <p><strong>Description:</strong> {program.programdescription}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApply(program.code)}
                        className="apply-button"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "notifications" ? (
          <div className="notifications-content">
            <h2 className="section-title">Notifications</h2>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div
                  key={notification.notifid}
                  className={`notification-item ${!notification.notificationstatus ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(notification.notifid)}
                >
                  <div className="notification-header">
                    <span className="notification-code">
                      {notification.code}
                    </span>
                    <span className="notification-date">
                      {notification.notificationstamp.toLocaleDateString()}
                    </span>
                  </div>
                  {expandedNotification === notification.notifid && (
                    <div className="notification-details">
                      <p>{notification.notificationmessage}</p>
                    </div>
                  )}
                </div>
                
              ))}
            </div>
          </div>
        ) : activeTab === "applied" ? (
          <div className="applied-content">
            <h2 className="section-title">Your Application</h2>
            <div className="admissions-list">
              {admissions.length === 0 ? (
                <div className="no-applications">
                  You haven't applied to any programs yet
                </div>
              ) : (
                admissions.map(admission => (
                  <div key={`${admission.appid}-${admission.code}`} className="admission-item">
                    <div className="admission-header">
                      <span className="program-code">{admission.code}</span>
                      <span className={`status ${admission.admissionstatus.toLowerCase()}`}>
                        {admission.admissionstatus}
                      </span>
                    </div>
                    <div className="admission-details">
                      <p>Applied on: {admission.applicationdate.toLocaleDateString()}</p>
                      {admission.feedback && (
                        <p className="feedback">Feedback: {admission.feedback}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApplicantDashboard;