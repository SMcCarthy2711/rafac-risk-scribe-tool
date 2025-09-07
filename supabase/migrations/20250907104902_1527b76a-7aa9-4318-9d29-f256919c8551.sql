-- Insert risk categories
INSERT INTO risk_categories (name) VALUES
('Physical Activities'),
('Travel and Transport'),
('Weather and Environment'),
('Equipment and Facilities'),
('Personnel and Supervision'),
('Medical and First Aid'),
('Security and Safety'),
('Communication')
ON CONFLICT DO NOTHING;

-- Insert risk subcategories
WITH category_ids AS (
  SELECT id, name FROM risk_categories
)
INSERT INTO risk_subcategories (category_id, name) 
SELECT 
  c.id,
  subcategory.name
FROM category_ids c
CROSS JOIN (VALUES
  ('Physical Activities', 'Sports and Recreation'),
  ('Physical Activities', 'Outdoor Activities'),
  ('Physical Activities', 'Adventure Training'),
  ('Travel and Transport', 'Vehicle Transport'),
  ('Travel and Transport', 'Public Transport'),
  ('Travel and Transport', 'Walking/Hiking'),
  ('Weather and Environment', 'Adverse Weather'),
  ('Weather and Environment', 'Temperature Extremes'),
  ('Weather and Environment', 'Natural Hazards'),
  ('Equipment and Facilities', 'Personal Equipment'),
  ('Equipment and Facilities', 'Venue Safety'),
  ('Equipment and Facilities', 'Specialized Equipment'),
  ('Personnel and Supervision', 'Supervision Ratios'),
  ('Personnel and Supervision', 'Cadet Behavior'),
  ('Personnel and Supervision', 'Staff Training'),
  ('Medical and First Aid', 'Medical Emergencies'),
  ('Medical and First Aid', 'First Aid Provision'),
  ('Medical and First Aid', 'Medication Management'),
  ('Security and Safety', 'Access Control'),
  ('Security and Safety', 'Emergency Procedures'),
  ('Communication', 'Radio Communications'),
  ('Communication', 'Emergency Contact')
) AS subcategory(category_name, name)
WHERE c.name = subcategory.category_name
ON CONFLICT DO NOTHING;

-- Insert pre-saved risks
WITH risk_data AS (
  SELECT 
    rc.id as category_id,
    rs.id as subcategory_id,
    rs.name as subcategory_name,
    rc.name as category_name
  FROM risk_categories rc
  JOIN risk_subcategories rs ON rc.id = rs.category_id
)
INSERT INTO pre_saved_risks (
  category_id, 
  subcategory_id, 
  activity_element, 
  hazards_identified, 
  who_might_be_harmed,
  existing_control_measures,
  additional_control_measures,
  required_actions,
  likelihood,
  impact
)
SELECT 
  rd.category_id,
  rd.subcategory_id,
  risk.activity_element,
  risk.hazards_identified,
  risk.who_might_be_harmed,
  risk.existing_control_measures,
  risk.additional_control_measures,
  risk.required_actions,
  risk.likelihood::integer,
  risk.impact::integer
FROM risk_data rd
CROSS JOIN (VALUES
  ('Sports and Recreation', 'Team sports activities', 'Collision injuries, sprains, cuts', 'Cadets and staff participating', 'First aid trained staff present, appropriate equipment checks', 'Brief participants on safety rules, ensure protective equipment worn', 'Check medical forms, designate first aider', '2', '3'),
  ('Sports and Recreation', 'Swimming activities', 'Drowning, slips on wet surfaces', 'All participants', 'Qualified lifeguard present, pool safety equipment available', 'Buddy system, non-swimmers identified', 'Ensure qualified supervision ratios', '2', '5'),
  ('Vehicle Transport', 'Minibus travel', 'Road traffic accidents, vehicle breakdown', 'All passengers', 'Qualified drivers, vehicle safety checks, insurance', 'Seat belts mandatory, emergency contact procedures', 'Driver briefing, route planning', '2', '4'),
  ('Vehicle Transport', 'Coach travel', 'Road traffic accidents, motion sickness', 'All passengers', 'Professional driver, vehicle maintenance', 'Emergency procedures briefed, first aid kit available', 'Passenger manifest, emergency contacts', '1', '4'),
  ('Adverse Weather', 'Activity in rain/wind', 'Slips, hypothermia, reduced visibility', 'All participants', 'Weather monitoring, appropriate clothing', 'Activity modification or cancellation procedures', 'Weather forecast checks, shelter available', '3', '3'),
  ('Adverse Weather', 'Hot weather activities', 'Heat exhaustion, dehydration, sunburn', 'All participants', 'Regular water breaks, sun protection advice', 'Shade provision, activity timing adjustment', 'Temperature monitoring, cooling measures', '3', '2'),
  ('Personal Equipment', 'Use of camping equipment', 'Equipment failure, cuts from sharp objects', 'Equipment users', 'Equipment checks before use, training provided', 'Backup equipment available, proper storage', 'Regular equipment inspections', '2', '2'),
  ('Venue Safety', 'Unfamiliar location usage', 'Slips, trips, falls, getting lost', 'All attendees', 'Site safety briefing, clear boundaries set', 'Buddy system, designated meeting points', 'Site reconnaissance, emergency procedures', '3', '3'),
  ('Supervision Ratios', 'Adequate supervision levels', 'Inadequate response to incidents', 'Cadets', 'Appropriate staff to cadet ratios maintained', 'Staff briefing on responsibilities', 'Staff duty rosters, clear communication', '2', '3'),
  ('Cadet Behavior', 'Inappropriate behavior', 'Injury to self or others, disciplinary issues', 'All participants', 'Clear behavioral expectations set', 'Supervision protocols, consequences known', 'Behavioral briefing, contact with parents', '3', '2'),
  ('Medical Emergencies', 'Serious injury or illness', 'Delayed medical response, condition deterioration', 'Injured person', 'First aid trained staff, emergency contacts', 'Emergency action plan, transport arrangements', 'Medical form review, emergency drills', '2', '4'),
  ('First Aid Provision', 'Inadequate first aid response', 'Minor injuries becoming serious', 'Injured participants', 'Qualified first aiders present, first aid kit available', 'Regular first aid training, equipment checks', 'First aid coverage planning', '2', '3'),
  ('Emergency Procedures', 'Emergency evacuation', 'Injury during evacuation, incomplete evacuation', 'All participants', 'Emergency procedures briefed, assembly points designated', 'Regular emergency drills, staff training', 'Emergency plan testing, communication systems', '2', '4'),
  ('Radio Communications', 'Communication failure', 'Inability to coordinate or call for help', 'All participants', 'Radio checks before activity, backup communications', 'Alternative communication methods planned', 'Radio training, communication protocols', '3', '3'),
  ('Walking/Hiking', 'Navigation errors', 'Getting lost, exposure to elements', 'Hiking group', 'Qualified leaders, navigation equipment', 'Route cards, emergency procedures', 'Navigation briefing, weather assessment', '2', '3'),
  ('Adventure Training', 'Rock climbing activities', 'Falls, equipment failure, cuts/bruises', 'Climbers and belayers', 'Qualified instructors, equipment safety checks', 'Proper safety equipment, supervision ratios', 'Technical safety briefing, rescue procedures', '2', '4')
) AS risk(subcategory_name, activity_element, hazards_identified, who_might_be_harmed, existing_control_measures, additional_control_measures, required_actions, likelihood, impact)
WHERE rd.subcategory_name = risk.subcategory_name
ON CONFLICT DO NOTHING;