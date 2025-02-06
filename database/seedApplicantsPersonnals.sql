CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO Applicants_Personnals (
  ApplicantName, 
  ApplicantEmail, 
  ApplicantPlainPassword, 
  ApplicantPassword
)
SELECT
  -- Generate applicant name
  first_names[(i % array_length(first_names, 1)) + 1] || ' ' || 
  last_names[(i % array_length(last_names, 1)) + 1] AS ApplicantName,
  
  -- Generate email
  LOWER(last_names[(i % array_length(last_names, 1)) + 1]) || (360 + i) || '@yarn.com' AS ApplicantEmail,
  
  -- Generate random 10-character plaintext password
  plain_password,
  
  -- Hash the plaintext password for secure storage
  crypt(plain_password, gen_salt('bf')) AS ApplicantPassword
FROM 
  generate_series(1, 100) AS i, -- Generate 100 rows
  (SELECT 
    ARRAY['Liam','Emma','Noah','Olivia','Dmitri','Sofia','Raj','Amina','Hiroshi','Mei'] AS first_names,
    ARRAY['Smith','Johnson','Veskov','Kumar','Chen','Ibrahim','Sato','Gonzalez','Müller','Dubois'] AS last_names
  ) AS names,
  -- Generate a unique plaintext password per row
  LATERAL (SELECT substr(md5(random()::text), 1, 10) AS plain_password) AS p;