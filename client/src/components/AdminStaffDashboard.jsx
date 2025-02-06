import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./AdminStaffDashboard.css";

const AdminStaffDashboard = ({ setAuth }) => {
  const [activeTab, setActiveTab] = useState("applicants");
  const [applicants, setApplicants] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [expandedAdmission, setExpandedAdmission] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  // Fetch applicants data
  const fetchApplicants = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/adminStaff/applicants", {
        headers: { token: localStorage.token }
      });
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      toast.error("Failed to fetch applicants");
    }
  };

  // Fetch admissions data
  const fetchAdmissions = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/adminStaff/admissions", {
        method: "GET",
        headers: { token: localStorage.token }
      });
      const data = await res.json();
      setAdmissions(data.map(admission => ({
        ...admission,
        applicationdate: new Date(admission.applicationdate)
      })));
    } catch (err) {
      toast.error("Failed to fetch admissions");
    }
  };

  // Fetch notifications data
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/applicant/allnotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.token
        },
        body: JSON.stringify({ appid })
      });

      const data = await response.json();
      setNotifications(data.map(notif => ({
        ...notif,
        notificationstamp: new Date(notif.notificationstamp)
      })));
      
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle status updates
  const handleStatusChange = async (appid, code, newStatus) => { // Add code parameter
    try {
      const response = await fetch("http://localhost:3000/auth/adminStaff/admissions/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token
        },
        body: JSON.stringify({
          appid,
          code, // Include code in request
          admissionstatus: newStatus,
          notificationmessage: statusMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      toast.success("Status updated successfully");
      fetchAdmissions();
      setStatusMessage("");
      setExpandedAdmission(null);

    } catch (err) {
      toast.error(err.message);
      console.error("Update error:", err);
    }
  };

  // Replace the problematic notification handling
  const handleNotificationClick = async (notifid) => {
    try {
      const response = await fetch("http://localhost:3000/auth/applicant/notification", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "token": localStorage.token
        },
        body: JSON.stringify({ notifid })
      });

      if (!response.ok) throw new Error("Failed to update notification");

      setNotifications(prev => prev.map(n => 
        n.notifid === notifid ? { ...n, notificationstatus: true } : n
      ));

    } catch (err) {
      console.error(err.message);
    }
  };

  // Logout handler
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("Logged out successfully");
  };

  // Filtered admissions based on status
  const filteredAdmissions = admissions.filter(admission =>
    statusFilter === "all" ? true : admission.admissionstatus.toLowerCase() === statusFilter
  );

  useEffect(() => {
    if (activeTab === "applicants") fetchApplicants();
    if (activeTab === "applications") fetchAdmissions();
    fetchNotifications();
  }, [activeTab]);

  return (
    <div className="dashboard-container">
      {/* Dark Sidebar */}
      <div className="dark-sidebar">
        <div className="menu-items">
          <div 
            className={`menu-item ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            Applicants
          </div>
          <div 
            className={`menu-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </div>
          <div 
            className="menu-item"
            onClick={logout}
          >
            Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content expanded-width">
        {activeTab === "applicants" ? (
          <div className="applicants-content">
            <h2 className="section-title">Applicant Directory</h2>
            <div className="applicants-grid">
              {applicants.map(applicant => (
                <div key={applicant.appid} className="applicant-card-wide">
                  <div className="applicant-header">
                    <div className="applicant-avatar-large">
                      {applicant.applicantname.charAt(0)}
                    </div>
                    <div className="applicant-info-wide">
                      <h3>{applicant.applicantname}</h3>
                      <p className="applicant-email">{applicant.applicantemail}</p>
                      <div className="applicant-meta">
                        <span className="application-date">
                          Applied: {new Date(applicant.applicationdate).toLocaleDateString()}
                        </span>
                        <span className={`status-badge ${applicant.admissionstatus?.toLowerCase()}`}>
                          {applicant.admissionstatus || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="applications-content-wide">
            <div className="filters-container">
              <h2 className="section-title">Admission Applications</h2>
              <div className="status-filters">
                <button 
                  className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('approved')}
                >
                  Approved
                </button>
                <button 
                  className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('rejected')}
                >
                  Rejected
                </button>
              </div>
            </div>

            <div className="applications-grid">
              {filteredAdmissions.map(admission => (
                <div 
                  key={`${admission.appid}-${admission.code}`}
                  className={`application-card-wide ${expandedAdmission === `${admission.appid}-${admission.code}` ? 'expanded' : ''}`}
                >
                  <div 
                    className="application-header-wide"
                    onClick={() => setExpandedAdmission(
                      expandedAdmission === `${admission.appid}-${admission.code}` 
                        ? null 
                        : `${admission.appid}-${admission.code}`
                    )}
                  >
                    <div className="program-info-wide">
                      <h3>{admission.programname}</h3>
                      <p className="applicant-name">{admission.applicantname}</p>
                    </div>
                    <div className="application-meta-wide">
                      <span className={`status-wide ${admission.admissionstatus?.toLowerCase()}`}>
                        {admission.admissionstatus}
                      </span>
                      <span className="toggle-icon">
                        {expandedAdmission === `${admission.appid}-${admission.code}` ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                  
                  {expandedAdmission === `${admission.appid}-${admission.code}` && (
                    <div className="application-details-wide">
                      <div className="detail-grid-wide">
                        <div className="detail-item-wide">
                          <label>Applicant Email:</label>
                          <p>{admission.applicantemail}</p>
                        </div>
                        <div className="detail-item-wide">
                          <label>Application Date:</label>
                          <p>{admission.applicationdate.toLocaleDateString()}</p>
                        </div>
                        <div className="detail-item-wide">
                          <label>Program Code:</label>
                          <p>{admission.code}</p>
                        </div>
                      </div>

                      <div className="status-actions-wide">
                        <textarea
                          className="message-input-wide"
                          placeholder="Enter status message..."
                          value={statusMessage}
                          onChange={(e) => setStatusMessage(e.target.value)}
                        />
                        <div className="action-buttons-wide">
                          <button 
                            className="approve-button-wide"
                            onClick={() => handleStatusChange(admission.appid, admission.code, 'approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-button-wide"
                            onClick={() => handleStatusChange(admission.appid, admission.code, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStaffDashboard;