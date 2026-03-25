/**
 * MongoDB Docker init script.
 * Runs on first container start. Ensures HMS database exists.
 */
db = db.getSiblingDB('hms');
print('HMS database initialized.');
