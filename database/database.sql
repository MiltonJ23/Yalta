--We will create the schema for the entitie of the database 


CREATE TABLE Applicants_Personnals(
    AppId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ApplicantName varchar(100) NOT NULL,
    ApplicantEmail varchar(100) NOT NULL,
    ApplicantPassword varchar(100) NOT NULL
);

CREATE TABLE Applicants_Contact(
    AppId uuid PRIMARY KEY,
    ApplicantPhone varchar(100) NOT NULL,
    FOREIGN KEY (AppId) REFERENCES Applicants_Personnals(AppId)
);


CREATE TABLE  Programs(
    Code varchar(100) PRIMARY KEY,
    ProgramName varchar(100) NOT NULL,
    ProgramDuration integer NOT NULL,
    ProgramDescription varchar(100) ,
    ProgramDepartment varchar(100) NOT NULL
);

CREATE TABLE Notifications(
    NotifId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    NotificationMessage text NOT NULL,
    NotificationStamp timestamp NOT NULL,
    AppId uuid NOT NULL,
    Code varchar(100) NOT NULL,
    FOREIGN KEY (AppId) REFERENCES Applicants_Personnals(AppId),
    FOREIGN KEY (Code) REFERENCES Programs(Code) 
);
ALTER TABLE Notifications 
ALTER  COLUMN NotificationMessage SET DEFAULT 'Your application has been received and is under review';


CREATE  TABLE  Admissions(
    AppId uuid ,
    Code varchar(100),
    ApplicationDate timestamp NOT NULL,
    AdmissionStatus varchar(100) NOT NULL ,
    PRIMARY KEY (AppId,Code),
    FOREIGN KEY (AppId) REFERENCES Applicants_Personnals(AppId),
    FOREIGN KEY (Code) REFERENCES Programs(Code)
);
    ALTER TABLE  Admissions 
    ALTER COLUMN AdmissionStatus SET DEFAULT 'Pending';

CREATE TABLE AdmissionStaff(
    StaffId uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    StaffName varchar(100) NOT NULL,
    StaffEmail varchar(100) NOT NULL,
    StaffPassword varchar(100) NOT NULL,
    StaffPlainPassword varchar(100) NOT NULL);



    ALTER TABLE Applicants_Personnals
    ADD COLUMN ApplicantPlainPassword varchar(100) NOT NULL;


    ALTER TABLE AdmissionStaff
    ADD COLUMN StaffPlainPassword varchar(100) NOT NULL;



    ALTER TABLE Notifications
    ADD COLUMN NotificationStatus Boolean DEFAULT FALSE;


