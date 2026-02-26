-- =============================================================
-- DisasterHQ Seed Data
-- Run this in your Supabase SQL Editor to populate all tables
-- =============================================================

-- ---------------------------------------------------------------
-- 1. ZONES
-- ---------------------------------------------------------------
INSERT INTO zone (zoneid, zonename, location, state, numresidents, risklevel) VALUES
  (1, 'North Ridge',      'Northern Hills District',    'California', 45200,  3),
  (2, 'Eastside Delta',   'Eastern Riverside Area',     'California', 31800,  4),
  (3, 'Central Metro',    'Downtown & Midtown',         'California', 92000,  2),
  (4, 'Southport Bay',    'Coastal Southern Zone',      'California', 28400,  5),
  (5, 'Westwood Valley',  'Western Suburban District',  'California', 67100,  2),
  (6, 'Harbor Industrial','Port & Industrial Area',     'California', 14300,  4),
  (7, 'Highland Park',    'Upland Residential District','California', 39600,  3),
  (8, 'Riverside Flats',  'Low-lying River Plains',     'California', 22900,  5)
ON CONFLICT (zoneid) DO NOTHING;

-- ---------------------------------------------------------------
-- 2. CRISIS TYPES
-- ---------------------------------------------------------------
INSERT INTO crisistype (crisistypeid, typename, defaultseverity, defaultdescription) VALUES
  (1,  'Earthquake',        4, 'Seismic event causing structural damage and potential casualties'),
  (2,  'Flood',             4, 'Rising water levels causing displacement and property damage'),
  (3,  'Wildfire',          5, 'Uncontrolled fire spreading through vegetation or structures'),
  (4,  'Hurricane',         5, 'Tropical cyclone with destructive winds and storm surge'),
  (5,  'Landslide',         4, 'Mass movement of soil or rock endangering residents'),
  (6,  'Gas Leak',          3, 'Hazardous gas leak requiring evacuation and emergency response'),
  (7,  'Power Outage',      2, 'Large-scale loss of electrical power affecting critical services'),
  (8,  'Chemical Spill',    4, 'Release of hazardous chemicals requiring containment'),
  (9,  'Medical Emergency', 3, 'Mass casualty or epidemic situation requiring medical response'),
  (10, 'Building Collapse', 5, 'Structural failure trapping occupants'),
  (11, 'Tsunami',           5, 'Ocean wave event threatening coastal areas'),
  (12, 'Drought',           2, 'Prolonged water shortage affecting agriculture and supply'),
  (13, 'Heatwave',          3, 'Extreme heat event endangering vulnerable populations'),
  (14, 'Tornado',           4, 'Rotating column of air causing destruction along its path')
ON CONFLICT (crisistypeid) DO NOTHING;

-- ---------------------------------------------------------------
-- 3. DEPARTMENTS
-- ---------------------------------------------------------------
INSERT INTO department (deptid, deptname, description, contactnumber, email) VALUES
  (1, 'Fire & Rescue',         'Fire suppression, rescue operations, and hazmat response', '555-0101', 'fire@disasterhq.gov'),
  (2, 'Emergency Medical',     'Medical triage, ambulance dispatch, and field hospitals',  '555-0102', 'ems@disasterhq.gov'),
  (3, 'Law Enforcement',       'Public order, evacuation enforcement, and crime prevention','555-0103', 'police@disasterhq.gov'),
  (4, 'Civil Engineering',     'Infrastructure assessment, repair, and hazard mitigation',  '555-0104', 'civil@disasterhq.gov'),
  (5, 'Search & Rescue',       'Urban search, wilderness rescue, and missing persons',      '555-0105', 'sar@disasterhq.gov'),
  (6, 'Public Health',         'Disease surveillance, water safety, and mass vaccination',  '555-0106', 'health@disasterhq.gov')
ON CONFLICT (deptid) DO NOTHING;

-- ---------------------------------------------------------------
-- 4. DEPT BRANCHES
-- ---------------------------------------------------------------
INSERT INTO deptbranch (branchid, deptid, zoneid, branchname, contactnumber, email, branchhead) VALUES
  (1, 1, 1, 'North Ridge Fire Station',      '555-1101', 'nr.fire@disasterhq.gov',  'Capt. Torres'),
  (2, 1, 4, 'Southport Fire Station',        '555-1102', 'sp.fire@disasterhq.gov',  'Capt. Nguyen'),
  (3, 2, 3, 'Central EMS Base',              '555-1201', 'cm.ems@disasterhq.gov',   'Dr. Patel'),
  (4, 3, 2, 'Eastside Police Precinct',      '555-1301', 'ep.pd@disasterhq.gov',    'Chief Ramirez'),
  (5, 4, 3, 'Metro Engineering HQ',          '555-1401', 'eng@disasterhq.gov',      'Director Kim'),
  (6, 5, 5, 'Westwood SAR Unit',             '555-1501', 'ww.sar@disasterhq.gov',   'Lt. Okafor'),
  (7, 6, 3, 'Public Health Command Centre',  '555-1601', 'phcc@disasterhq.gov',     'Dr. Shapiro'),
  (8, 1, 6, 'Harbor Fire & Hazmat Unit',     '555-1103', 'hb.fire@disasterhq.gov',  'Capt. Williams')
ON CONFLICT (branchid) DO NOTHING;

-- ---------------------------------------------------------------
-- 5. AUTHORITY (RESPONDERS)
-- ---------------------------------------------------------------
INSERT INTO authority (authorityid, fname, lname, rank, badgenumber, branchid, contactnumber, email, availabilitystatus, passwordhash) VALUES
  (1,  'Marcus',   'Torres',    'Captain',         'FR-001', 1, '555-2001', 'torres@disasterhq.gov',    'AVAILABLE', 'hash_placeholder'),
  (2,  'Linh',     'Nguyen',    'Captain',         'FR-002', 2, '555-2002', 'nguyen@disasterhq.gov',    'AVAILABLE', 'hash_placeholder'),
  (3,  'Priya',    'Patel',     'Doctor',          'EM-001', 3, '555-2003', 'patel@disasterhq.gov',     'AVAILABLE', 'hash_placeholder'),
  (4,  'Carlos',   'Ramirez',   'Chief',           'PD-001', 4, '555-2004', 'ramirez@disasterhq.gov',   'ONDUTY',    'hash_placeholder'),
  (5,  'Ji-Woo',   'Kim',       'Director',        'CE-001', 5, '555-2005', 'kim@disasterhq.gov',       'AVAILABLE', 'hash_placeholder'),
  (6,  'Amara',    'Okafor',    'Lieutenant',      'SR-001', 6, '555-2006', 'okafor@disasterhq.gov',    'AVAILABLE', 'hash_placeholder'),
  (7,  'Rachel',   'Shapiro',   'Doctor',          'PH-001', 7, '555-2007', 'shapiro@disasterhq.gov',   'AVAILABLE', 'hash_placeholder'),
  (8,  'Derek',    'Williams',  'Captain',         'FR-003', 8, '555-2008', 'williams@disasterhq.gov',  'ONDUTY',    'hash_placeholder'),
  (9,  'Sofia',    'Mendez',    'Lieutenant',      'FR-004', 1, '555-2009', 'mendez@disasterhq.gov',    'AVAILABLE', 'hash_placeholder'),
  (10, 'Tariq',    'Hassan',    'Sergeant',        'PD-002', 4, '555-2010', 'hassan@disasterhq.gov',    'AVAILABLE', 'hash_placeholder'),
  (11, 'Elena',    'Vasquez',   'Paramedic',       'EM-002', 3, '555-2011', 'vasquez@disasterhq.gov',   'AVAILABLE', 'hash_placeholder'),
  (12, 'Ben',      'Foster',    'Engineer',        'CE-002', 5, '555-2012', 'foster@disasterhq.gov',    'OFFLINE',   'hash_placeholder')
ON CONFLICT (authorityid) DO NOTHING;

-- Update department heads now that authorities exist
UPDATE department SET depthead = 1 WHERE deptid = 1;
UPDATE department SET depthead = 3 WHERE deptid = 2;
UPDATE department SET depthead = 4 WHERE deptid = 3;
UPDATE department SET depthead = 5 WHERE deptid = 4;
UPDATE department SET depthead = 6 WHERE deptid = 5;
UPDATE department SET depthead = 7 WHERE deptid = 6;

-- ---------------------------------------------------------------
-- 6. DEPT handles CRISIS TYPE mapping
-- ---------------------------------------------------------------
INSERT INTO depthandlecrisistype (deptid, crisistypeid) VALUES
  (1, 1),(1, 3),(1, 6),(1, 8),(1, 10),       -- Fire & Rescue handles Earthquake, Wildfire, Gas Leak, Chemical Spill, Building Collapse
  (2, 9),(2, 13),(2, 1),                       -- EMS handles Medical Emergency, Heatwave, Earthquake
  (3, 1),(3, 4),(3, 3),                        -- Law Enforcement handles Earthquake, Hurricane, Wildfire
  (4, 1),(4, 2),(4, 5),(4, 10),(4, 7),         -- Civil Engineering handles Earthquake, Flood, Landslide, Collapse, Outage
  (5, 1),(5, 5),(5, 10),(5, 4),                -- SAR handles Earthquake, Landslide, Collapse, Hurricane
  (6, 9),(6, 8),(6, 12),(6, 13)                -- Public Health handles Medical, Chemical, Drought, Heatwave
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 7. FAMILIES
-- ---------------------------------------------------------------
INSERT INTO family (familyid, familyname, nummembers, cumulativelevel) VALUES
  (1, 'Chen Family',    3, 6),
  (2, 'Okafor Family',  5, 8),
  (3, 'Martinez Family',2, 4),
  (4, 'Patel Family',   4, 10),
  (5, 'Johnson Family', 2, 3)
ON CONFLICT (familyid) DO NOTHING;

-- ---------------------------------------------------------------
-- 8. USERS
--   level >= 5 → ADMIN, wishtovolunteer = true → VOLUNTEER, else CITIZEN
-- ---------------------------------------------------------------
INSERT INTO "User" (userid, fname, lname, phone, zoneid, familyid, level, wishtovolunteer, registrationdate, passwordhash) VALUES
  -- Admins (level >= 5)
  (1,  'Sarah',    'Chen',      '555-3001', 3, 1,  8,     false, '2023-01-15', 'hash_placeholder'),
  (2,  'Omar',     'Johnson',   '555-3002', 1, 5,  7,     false, '2023-02-20', 'hash_placeholder'),
  -- Volunteers (wishtovolunteer = true, level < 5)
  (3,  'Kenji',    'Yamamoto',  '555-3003', 2, NULL, 2,   true,  '2023-03-10', 'hash_placeholder'),
  (4,  'Aisha',    'Okafor',    '555-3004', 5, 2,   3,   true,  '2023-04-05', 'hash_placeholder'),
  (5,  'Tyler',    'Brooks',    '555-3005', 4, NULL, 1,   true,  '2023-05-12', 'hash_placeholder'),
  (6,  'Mei',      'Lin',       '555-3006', 7, 4,   2,   true,  '2023-06-18', 'hash_placeholder'),
  -- Citizens
  (7,  'James',    'Martinez',  '555-3007', 1, 3,   1,   false, '2023-07-22', 'hash_placeholder'),
  (8,  'Fatima',   'Al-Hassan', '555-3008', 2, NULL, 1,  false, '2023-08-14', 'hash_placeholder'),
  (9,  'Lucas',    'Novak',     '555-3009', 4, NULL, 2,  false, '2023-09-01', 'hash_placeholder'),
  (10, 'Grace',    'Adeyemi',   '555-3010', 3, NULL, 1,  false, '2023-10-30', 'hash_placeholder'),
  (11, 'Ravi',     'Patel',     '555-3011', 6, 4,   1,  false, '2023-11-11', 'hash_placeholder'),
  (12, 'Nadia',    'Kowalski',  '555-3012', 8, NULL, 2,  false, '2024-01-08', 'hash_placeholder')
ON CONFLICT (userid) DO NOTHING;

-- ---------------------------------------------------------------
-- 9. REQUESTS (disaster reports)
-- ---------------------------------------------------------------
INSERT INTO request (requestid, title, crisistypeid, createdby, zoneid, severity, description, status, numvolunteerneeded, startdatetime, enddatetime) VALUES
  (1,  'Flooding in Riverside Flats',
       2, 8, 8, 5,
       'Severe flooding after 3 days of heavy rain. Multiple homes submerged, residents stranded on rooftops. Road access cut off. Immediate evacuation and rescue boats needed.',
       'InProgress', 10, NOW() - INTERVAL '2 days', NULL),

  (2,  'Wildfire Spreading Near Southport Bay',
       3, 9, 4, 5,
       'Fast-moving wildfire jumped the firebreak overnight. Wind-driven spread toward residential areas. Evacuation order issued for zones 4 and 8. Air support requested.',
       'InProgress', 20, NOW() - INTERVAL '18 hours', NULL),

  (3,  'Gas Leak at Harbor Industrial Zone',
       6, 11, 6, 3,
       'Large natural gas leak detected at industrial storage facility. One-mile exclusion zone established. Potential for explosion. Hazmat team and evacuation support needed.',
       'Open', 5, NOW() - INTERVAL '4 hours', NULL),

  (4,  'Building Collapse - North Ridge',
       10, 7, 1, 4,
       'Partial collapse of 6-storey apartment building following minor tremor. Unknown number of occupants trapped. Heavy rescue equipment and medical teams required urgently.',
       'InProgress', 15, NOW() - INTERVAL '6 hours', NULL),

  (5,  'Power Outage Affecting Central Metro',
       7, 10, 3, 2,
       'Grid failure has knocked out power to 40,000 residents. Hospitals on backup generators. Traffic signals offline causing gridlock. Utility crews need security escort.',
       'Open', 8, NOW() - INTERVAL '2 hours', NULL),

  (6,  'Landslide Blocking Highway 12',
       5, 12, 7, 3,
       'Large landslide has completely blocked the main highway and crushed two vehicles. Three people reported missing. Heavy machinery needed to clear debris and search for survivors.',
       'Open', 6, NOW() - INTERVAL '5 hours', NULL),

  (7,  'Heatwave Emergency - Westwood Valley',
       13, 10, 5, 2,
       'Temperatures exceeding 108°F. Multiple heat stroke cases reported. Elderly care homes requesting emergency cooling. Mobile cooling stations and medical teams needed across zone.',
       'Resolved', 12, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),

  (8,  'Chemical Spill at Harbor Facility',
       8, 11, 6, 1,
       'Chlorine tank rupture at water treatment plant. Toxic cloud moving NE. Shelter-in-place order for 2km radius. Hazmat decontamination and public health response critical.',
       'Closed', 6, NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),

  (9,  'Medical Emergency - Mass Food Poisoning',
       9, 8, 3, 4,
       '60+ people experiencing severe symptoms after community event. Local hospital overwhelmed. Field triage station established. Need additional medical personnel and supplies.',
       'Resolved', 20, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),

  (10, 'Earthquake Damage Assessment - Highland Park',
       1, 7, 7, 3,
       'M4.8 earthquake caused visible structural damage to several buildings. Multiple aftershocks expected. Need engineering assessment teams and temporary shelter for displaced residents.',
       'Open', 8, NOW() - INTERVAL '1 hour', NULL),

  (11, 'Flood Warning - Eastside Delta',
       2, 3, 2, 4,
       'River level rising rapidly. Forecast predicts it will exceed flood stage within 6 hours. Pre-emptive evacuation of low-lying areas recommended. Sandbag deployment requested.',
       'Open', 3, NOW() - INTERVAL '30 minutes', NULL),

  (12, 'Tornado Warning - Harbor Industrial',
       14, 9, 6, 3,
       'Tornado touched down 5 miles west, moving toward industrial zone. Evacuation of outdoor workers ordered. Emergency shelters being prepared at community centers.',
       'InProgress', 5, NOW() - INTERVAL '45 minutes', NULL)
ON CONFLICT (requestid) DO NOTHING;

-- ---------------------------------------------------------------
-- 10. AUTHORITY ASSIGNMENTS
-- ---------------------------------------------------------------
INSERT INTO authorityassignment (requestid, authorityid, status, notes, assignedat, completedat) VALUES
  -- Flooding response
  (1, 6,  'InProgress', 'SAR team deployed with rescue boats. 12 residents evacuated so far.',             NOW() - INTERVAL '36 hours',  NULL),
  (1, 11, 'InProgress', 'EMS triage station set up at North Ridge Community Center.',                      NOW() - INTERVAL '30 hours',  NULL),
  -- Wildfire
  (2, 1,  'InProgress', 'Fire suppression teams from North Ridge deployed to firebreak.',                  NOW() - INTERVAL '16 hours',  NULL),
  (2, 2,  'InProgress', 'Southport fire crews managing southern perimeter.',                              NOW() - INTERVAL '14 hours',  NULL),
  (2, 10, 'InProgress', 'Law enforcement coordinating mandatory evacuation.',                              NOW() - INTERVAL '15 hours',  NULL),
  -- Building collapse
  (4, 6,  'InProgress', 'SAR team conducting floor-by-floor search.',                                     NOW() - INTERVAL '5 hours',   NULL),
  (4, 3,  'InProgress', 'EMS treating injured survivors extracted from rubble.',                           NOW() - INTERVAL '5 hours',   NULL),
  -- Resolved heatwave
  (7, 3,  'Completed',  'Medical teams provided cooling treatment to 47 patients.',                        NOW() - INTERVAL '4 days',    NOW() - INTERVAL '1 day'),
  (7, 7,  'Completed',  'Public health coordinated cooling centres across zone.',                          NOW() - INTERVAL '4 days',    NOW() - INTERVAL '1 day'),
  -- Closed chemical spill
  (8, 8,  'Completed',  'Hazmat team contained spill and decontaminated affected area.',                   NOW() - INTERVAL '10 days',   NOW() - INTERVAL '8 days'),
  (8, 7,  'Completed',  'Public health cleared area as safe after air quality checks.',                    NOW() - INTERVAL '10 days',   NOW() - INTERVAL '8 days'),
  -- Resolved medical emergency
  (9, 3,  'Completed',  'EMS teams treated and discharged all patients over 48 hours.',                    NOW() - INTERVAL '3 days',    NOW() - INTERVAL '1 day'),
  -- Tornado
  (12, 1, 'InProgress', 'Fire crews setting up emergency shelters at community centres.',                  NOW() - INTERVAL '40 minutes', NULL),
  (12, 4, 'InProgress', 'Police coordinating evacuation of outdoor workers.',                              NOW() - INTERVAL '35 minutes', NULL)
ON CONFLICT (requestid, authorityid) DO NOTHING;

-- ---------------------------------------------------------------
-- 11. USER HELP (volunteer activity)
-- ---------------------------------------------------------------
INSERT INTO userhelp (requestid, userid, status, joinedat, completedat) VALUES
  -- Active volunteers on flooding
  (1, 3,  'Active',     NOW() - INTERVAL '1 day',   NULL),
  (1, 4,  'Active',     NOW() - INTERVAL '20 hours', NULL),
  (1, 5,  'Active',     NOW() - INTERVAL '18 hours', NULL),
  -- Active on wildfire
  (2, 3,  'Active',     NOW() - INTERVAL '14 hours', NULL),
  (2, 6,  'Active',     NOW() - INTERVAL '12 hours', NULL),
  -- Completed on resolved heatwave
  (7, 4,  'Completed',  NOW() - INTERVAL '4 days',  NOW() - INTERVAL '1 day'),
  (7, 5,  'Completed',  NOW() - INTERVAL '4 days',  NOW() - INTERVAL '1 day'),
  (7, 6,  'Completed',  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 day'),
  -- Completed on resolved medical emergency
  (9, 3,  'Completed',  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 day'),
  (9, 4,  'Completed',  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 day'),
  -- Building collapse
  (4, 5,  'Active',     NOW() - INTERVAL '4 hours',  NULL),
  -- Heatwave withdrawn
  (7, 3,  'Withdrawn',  NOW() - INTERVAL '4 days',  NOW() - INTERVAL '3 days')
ON CONFLICT (requestid, userid) DO NOTHING;
