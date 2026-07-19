export interface ResolvedDestination {
   requestedDestination: string;
   physicalBlock: string | null;
}

const campusKnowledgeBase: Record<string, string> = {
   // Main facilities
   "Main Gate": "Main Gate",
   "Bus Terminal": "Bus Terminal",
   "Boys Hostel": "Boys Hostel",
   "Canteen": "Canteen",
   "Generator Room": "Generator Room",
   "Cricket Ground": "Cricket Ground",
   "Ground A": "Ground A",
   "Ground B": "Ground B",
   "Basketball Court": "Basketball Court",
   "Badminton Court 1": "Badminton Court 1",
   "Badminton Court 2": "Badminton Court 2",
   "2-Wheeler Parking": "2-Wheeler Parking",
   "4-Wheeler Parking": "4-Wheeler Parking",

   // Workshops & ME
   "Workshop 1": "Workshop 1",
   "Workshop 2": "Workshop 2",
   "ME Block": "ME Block",
   "Mechanical Engineering": "ME Block",
   "Mechanical": "ME Block",
   "MECH": "ME Block",
   "ME Lab 1": "ME Block",
   "ME Lab 2": "ME Block",

   // RV Block
   "RV Block": "RV Block",
   "Principal Room": "RV Block",
   "Office Room": "RV Block",
   "Office": "RV Block",
   "Controller of Examinations": "RV Block",
   "CoE": "RV Block",
   "Physics Lab": "RV Block",
   "Chemistry Lab": "RV Block",
   "First Year": "RV Block",
   "CSE": "RV Block",
   "Computer Science": "RV Block",

   // KS Block
   "KS Block": "KS Block",
   "ECE": "KS Block",
   "EEE": "KS Block",
   "ICE": "KS Block",
   "IT": "KS Block",
   "Circuit Lab 1": "KS Block",
   "Circuit Lab 2": "KS Block",
   "Sick Room": "KS Block",

   // BD Block
   "BD Block": "BD Block",
   "AIML": "BD Block",
   "AIDS": "BD Block",
   "CSBS": "BD Block",
   "BD Lab 1": "BD Block",

   // JS-CH Block
   "JS-CH Block": "JS-CH Block",
   "JS Conference Hall": "JS-CH Block",
   "JS Lab 1": "JS-CH Block",

   // MBA Block
   "MBA Block": "MBA Block",
   "MBA": "MBA Block"
};

export function resolveDestination(query: string): ResolvedDestination {
   if (!query) return { requestedDestination: "", physicalBlock: null };
   
   const cleanQuery = query.toLowerCase().trim();

   for (const [key, block] of Object.entries(campusKnowledgeBase)) {
       if (key.toLowerCase() === cleanQuery) {
           return {
               requestedDestination: query,
               physicalBlock: block
           };
       }
       
       // Use word boundary to avoid partial matches (e.g. "it" matching inside "with")
       // Escape special characters in key just in case, though none exist currently
       const escapedKey = key.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       const regex = new RegExp(`\\b${escapedKey}\\b`);
       
       if (regex.test(cleanQuery)) {
           return {
               requestedDestination: query,
               physicalBlock: block
           };
       }
   }

   return {
       requestedDestination: query,
       physicalBlock: null
   };
}
