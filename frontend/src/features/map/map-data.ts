export type LocationCategory = "Academic" | "Sports" | "Transport" | "Utility" | "Hostel" | "Parking";

export interface PhysicalLocation {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  coordinates: { x: number; y: number };
}

export const physicalLocations: Record<string, PhysicalLocation> = {
  "Main Gate": { id: "Main Gate", name: "Main Gate", category: "Utility", description: "Primary entrance and exit for the college campus.", coordinates: { x: 0.520, y: 0.950 } },
  "Bus Terminal": { id: "Bus Terminal", name: "Bus Terminal", category: "Transport", description: "Terminal for all college buses and transport services.", coordinates: { x: 0.660, y: 0.760 } },
  "RV Block": { id: "RV Block", name: "RV Block", category: "Academic", description: "Houses the Principal's Office, First Year departments, and core computer labs.", coordinates: { x: 0.720, y: 0.530 } },
  "KS Block": { id: "KS Block", name: "KS Block", category: "Academic", description: "Houses ECE, EEE, ICE, and IT departments along with circuit labs.", coordinates: { x: 0.520, y: 0.550 } },
  "BD Block": { id: "BD Block", name: "BD Block", category: "Academic", description: "Home to AIML, AIDS, and CSBS departments.", coordinates: { x: 0.690, y: 0.430 } },
  "JS-CH Block": { id: "JS-CH Block", name: "JS-CH Block", category: "Academic", description: "Contains JS Conference Hall and advanced laboratory facilities.", coordinates: { x: 0.750, y: 0.430 } },
  "MBA Block": { id: "MBA Block", name: "MBA Block", category: "Academic", description: "Department of Management Studies.", coordinates: { x: 0.720, y: 0.460 } },
  "ME Block": { id: "ME Block", name: "ME Block", category: "Academic", description: "Mechanical Engineering block and related laboratories.", coordinates: { x: 0.520, y: 0.390 } },
  "Workshop 1": { id: "Workshop 1", name: "Workshop 1", category: "Academic", description: "Heavy machinery and manufacturing workshop.", coordinates: { x: 0.520, y: 0.340 } },
  "Workshop 2": { id: "Workshop 2", name: "Workshop 2", category: "Academic", description: "Secondary mechanical workshop.", coordinates: { x: 0.520, y: 0.490 } },
  "Boys Hostel": { id: "Boys Hostel", name: "Boys Hostel", category: "Hostel", description: "Residential block for male students.", coordinates: { x: 0.760, y: 0.250 } },
  "Canteen": { id: "Canteen", name: "Canteen", category: "Utility", description: "Main campus food court and cafeteria.", coordinates: { x: 0.520, y: 0.420 } },
  "Generator Room": { id: "Generator Room", name: "Generator Room", category: "Utility", description: "Central power backup facility.", coordinates: { x: 0.520, y: 0.460 } },
  "Cricket Ground": { id: "Cricket Ground", name: "Cricket Ground", category: "Sports", description: "Main sports ground for cricket tournaments.", coordinates: { x: 0.380, y: 0.160 } },
  "Ground A": { id: "Ground A", name: "Ground A", category: "Sports", description: "Multipurpose athletic ground.", coordinates: { x: 0.300, y: 0.760 } },
  "Ground B": { id: "Ground B", name: "Ground B", category: "Sports", description: "Secondary athletic ground.", coordinates: { x: 0.280, y: 0.620 } },
  "Basketball Court": { id: "Basketball Court", name: "Basketball Court", category: "Sports", description: "Outdoor basketball facility.", coordinates: { x: 0.720, y: 0.620 } },
  "Badminton Court 1": { id: "Badminton Court 1", name: "Badminton Court 1", category: "Sports", description: "Indoor badminton court.", coordinates: { x: 0.430, y: 0.300 } },
  "Badminton Court 2": { id: "Badminton Court 2", name: "Badminton Court 2", category: "Sports", description: "Secondary badminton court.", coordinates: { x: 0.470, y: 0.300 } },
  "2-Wheeler Parking": { id: "2-Wheeler Parking", name: "2-Wheeler Parking", category: "Parking", description: "Designated parking for motorcycles and scooters.", coordinates: { x: 0.720, y: 0.360 } },
  "4-Wheeler Parking": { id: "4-Wheeler Parking", name: "4-Wheeler Parking", category: "Parking", description: "Designated parking for cars and faculty vehicles.", coordinates: { x: 0.840, y: 0.460 } }
};

export interface BuildingContents {
   departments: string[];
   facilities: string[];
}

export const campusBuildings: Record<string, BuildingContents> = {
  "RV Block": { 
     departments: ["First Year", "CSE"],
     facilities: ["Principal Room", "Office", "Controller of Examinations (CoE)", "Physics Lab", "Chemistry Lab", "RV Computer Lab 1 & 2"] 
  },
  "KS Block": { 
     departments: ["ECE", "EEE", "ICE", "IT"],
     facilities: ["Circuit Lab 1 & 2", "Core Faculty Room", "Sick Room"] 
  },
  "BD Block": { 
     departments: ["AIML", "AIDS", "CSBS"],
     facilities: ["BD Lab 1, 2, 3 & 4", "Department Staff Rooms"] 
  },
  "JS-CH Block": {
     departments: [],
     facilities: ["JS Lab 1, 2, 3 & 4", "JS Conference Hall"]
  },
  "MBA Block": {
     departments: ["MBA"],
     facilities: []
  },
  "ME Block": { 
     departments: ["Mechanical Engineering"],
     facilities: ["ME Lab 1 & 2", "Mechanical Faculty Room"] 
  }
};

// ========================================================
// GRAPH ROUTING MODEL
// ========================================================

export interface GraphNode {
   id: string;
   x: number;
   y: number;
}

export const navigationNodes: Record<string, GraphNode> = {
   "Main Gate": { id: "Main Gate", x: 0.520, y: 0.950 },
   "Bus Terminal": { id: "Bus Terminal", x: 0.660, y: 0.760 },
   "RV Block": { id: "RV Block", x: 0.720, y: 0.530 },
   "KS Block": { id: "KS Block", x: 0.520, y: 0.550 },
   "BD Block": { id: "BD Block", x: 0.690, y: 0.430 },
   "JS-CH Block": { id: "JS-CH Block", x: 0.750, y: 0.430 },
   "MBA Block": { id: "MBA Block", x: 0.720, y: 0.460 },
   "ME Block": { id: "ME Block", x: 0.520, y: 0.390 },
   "Workshop 1": { id: "Workshop 1", x: 0.520, y: 0.340 },
   "Workshop 2": { id: "Workshop 2", x: 0.520, y: 0.490 },
   "Boys Hostel": { id: "Boys Hostel", x: 0.760, y: 0.250 },
   "Canteen": { id: "Canteen", x: 0.520, y: 0.420 },
   "Generator Room": { id: "Generator Room", x: 0.520, y: 0.460 },
   "Cricket Ground": { id: "Cricket Ground", x: 0.380, y: 0.160 },
   "Ground A": { id: "Ground A", x: 0.300, y: 0.760 },
   "Ground B": { id: "Ground B", x: 0.280, y: 0.620 },
   "Basketball Court": { id: "Basketball Court", x: 0.720, y: 0.620 },
   "Badminton Court 1": { id: "Badminton Court 1", x: 0.430, y: 0.300 },
   "Badminton Court 2": { id: "Badminton Court 2", x: 0.470, y: 0.300 },
   "2-Wheeler Parking": { id: "2-Wheeler Parking", x: 0.720, y: 0.360 },
   "4-Wheeler Parking": { id: "4-Wheeler Parking", x: 0.840, y: 0.460 },

   // Hidden Road Junction Nodes
   "J_Roundabout": { id: "J_Roundabout", x: 0.520, y: 0.880 },
   "J_BusTurn": { id: "J_BusTurn", x: 0.600, y: 0.880 },
   
   "C_1": { id: "C_1", x: 0.460, y: 0.760 },
   "C_2": { id: "C_2", x: 0.460, y: 0.620 },
   "C_3": { id: "C_3", x: 0.460, y: 0.550 },
   "C_4": { id: "C_4", x: 0.460, y: 0.490 },
   "C_5": { id: "C_5", x: 0.460, y: 0.460 },
   "C_6": { id: "C_6", x: 0.460, y: 0.420 },
   "C_7": { id: "C_7", x: 0.460, y: 0.390 },
   "C_8": { id: "C_8", x: 0.460, y: 0.340 },
   "C_9": { id: "C_9", x: 0.460, y: 0.300 },
   "C_10": { id: "C_10", x: 0.460, y: 0.250 },
   
   "E_1": { id: "E_1", x: 0.600, y: 0.620 },
   "E_2": { id: "E_2", x: 0.800, y: 0.620 },
   "E_3": { id: "E_3", x: 0.800, y: 0.530 },
   "E_4": { id: "E_4", x: 0.800, y: 0.460 },
   "E_5": { id: "E_5", x: 0.800, y: 0.360 },
   "E_6": { id: "E_6", x: 0.800, y: 0.250 },
   
   "Cross_1": { id: "Cross_1", x: 0.600, y: 0.530 },
   "Cross_2": { id: "Cross_2", x: 0.600, y: 0.440 }
};

export const graphEdges: [string, string][] = [
   ["Main Gate", "J_Roundabout"],
   ["J_Roundabout", "J_BusTurn"],
   ["J_BusTurn", "Bus Terminal"],
   
   ["J_Roundabout", "C_1"],
   ["C_1", "C_2"],
   ["C_2", "C_3"],
   ["C_3", "C_4"],
   ["C_4", "C_5"],
   ["C_5", "C_6"],
   ["C_6", "C_7"],
   ["C_7", "C_8"],
   ["C_8", "C_9"],
   ["C_9", "C_10"],
   
   ["C_1", "Ground A"],
   ["C_2", "Ground B"],
   ["C_3", "KS Block"],
   ["C_4", "Workshop 2"],
   ["C_5", "Generator Room"],
   ["C_6", "Canteen"],
   ["C_7", "ME Block"],
   ["C_8", "Workshop 1"],
   ["C_9", "Badminton Court 1"],
   ["C_9", "Badminton Court 2"],
   ["C_10", "Cricket Ground"],
   
   ["C_2", "E_1"], 
   ["E_1", "Basketball Court"],
   ["E_1", "E_2"],
   ["E_2", "E_3"],
   ["E_3", "E_4"],
   ["E_4", "E_5"],
   ["E_5", "E_6"],
   
   ["C_3", "Cross_1"],
   ["Cross_1", "RV Block"],
   ["Cross_1", "E_3"],
   
   ["C_6", "Cross_2"],
   ["Cross_2", "BD Block"],
   ["Cross_2", "JS-CH Block"],
   ["Cross_2", "MBA Block"],
   ["Cross_2", "E_4"],
   
   ["E_4", "4-Wheeler Parking"],
   ["E_5", "2-Wheeler Parking"],
   ["E_6", "Boys Hostel"]
];
