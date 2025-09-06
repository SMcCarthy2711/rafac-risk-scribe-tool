-- Migrate orphaned data by assigning records to the first available user
-- This is a one-time migration to fix existing data without user_id

DO $$
DECLARE
    first_user_id uuid;
BEGIN
    -- Get the first user from auth.users (this is a temporary fix)
    SELECT id INTO first_user_id 
    FROM auth.users 
    LIMIT 1;

    -- Only proceed if we have at least one user
    IF first_user_id IS NOT NULL THEN
        -- Update risk_assessments without user_id
        UPDATE risk_assessments 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        -- Update event_plans without user_id  
        UPDATE event_plans 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        -- Update event_schedules without user_id
        UPDATE event_schedules 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        -- Update joining_orders without user_id
        UPDATE joining_orders 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        -- Update kit_lists without user_id
        UPDATE kit_lists 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        -- Update travel_plans without user_id
        UPDATE travel_plans 
        SET user_id = first_user_id 
        WHERE user_id IS NULL;

        RAISE NOTICE 'Orphaned data migration completed for user %', first_user_id;
    ELSE
        RAISE NOTICE 'No users found - orphaned data migration skipped';
    END IF;
END
$$;