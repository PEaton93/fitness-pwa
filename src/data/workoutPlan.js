export const WORKOUT_DAYS = {
  1: {
    name: "Push A",
    dayLabel: "Monday",
    exercises: [
      { id: "bench_press", name: "Barbell bench press", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "ohp", name: "Standing overhead press", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "incline_db_press", name: "Incline dumbbell press", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "lateral_raise", name: "Dumbbell lateral raise", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "tricep_pushdown", name: "Cable triceps pushdown", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "dips", name: "Assisted dips / bodyweight dips", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
    ]
  },
  2: {
    name: "Pull A",
    dayLabel: "Tuesday",
    exercises: [
      { id: "deadlift", name: "Deadlift", sets: 3, reps: "5-6", type: "weight", category: "main" },
      { id: "bent_row", name: "Bent-over row", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "lat_pulldown", name: "Lat pulldown / pull-up", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "cable_row", name: "Seated cable row", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "face_pull", name: "Face pull", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "ez_curl", name: "EZ-bar curl", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
    ]
  },
  3: {
    name: "Legs",
    dayLabel: "Wednesday",
    exercises: [
      { id: "squat", name: "Back squat", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "rdl", name: "Romanian deadlift", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "leg_press", name: "Leg press", sets: 3, reps: "10-12", type: "weight", category: "secondary" },
      { id: "lunges", name: "Walking lunges", sets: 3, reps: "10 each leg", type: "weight", category: "secondary" },
      { id: "leg_curl", name: "Leg curl", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "calf_raise", name: "Standing calf raise", sets: 3, reps: "12-15", type: "weight", category: "accessory" },
    ]
  },
  4: {
    name: "Push B",
    dayLabel: "Thursday",
    exercises: [
      { id: "incline_bar_press", name: "Incline barbell / smith press", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "seated_db_press", name: "Seated dumbbell shoulder press", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "machine_chest", name: "Machine chest press", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "cable_flye", name: "Cable flye", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "overhead_tri_ext", name: "Overhead triceps extension", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "lat_raise_burnout", name: "Lateral raise burnout", sets: 3, reps: "12-15", type: "weight", category: "accessory" },
    ]
  },
  5: {
    name: "Pull B + Core",
    dayLabel: "Friday",
    exercises: [
      { id: "chest_supported_row", name: "Chest-supported row", sets: 3, reps: "6-8", type: "weight", category: "main" },
      { id: "pullup_neutral", name: "Pull-up / neutral-grip pulldown", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "single_arm_row", name: "Single-arm dumbbell row", sets: 3, reps: "8-10", type: "weight", category: "secondary" },
      { id: "rear_delt_flye", name: "Rear delt flye", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "hammer_curl", name: "Hammer curl", sets: 3, reps: "10-12", type: "weight", category: "accessory" },
      { id: "plank", name: "Plank", sets: 3, reps: "45-60 sec", type: "time", category: "core" },
      { id: "farmer_carry", name: "Farmer carry", sets: 3, reps: "rounds", type: "carry", category: "core" },
    ]
  }
};

export const PROGRESSION_RULES = {
  1: "Leave 2-3 reps in reserve on every set. Focus on form.",
  2: "Leave 2-3 reps in reserve on every set. Focus on form.",
  3: "Push compounds to the top of the rep range before adding weight.",
  4: "Push compounds to the top of the rep range before adding weight.",
  5: "Add weight when all 3 sets hit top of rep range with solid form.",
  6: "Add weight when all 3 sets hit top of rep range with solid form.",
  7: "Keep load climbing on compounds. Add one hard final set on last accessory if recovery is good.",
  8: "Keep load climbing on compounds. Add one hard final set on last accessory if recovery is good.",
};

export const DAILY_TARGETS = {
  calories: 2577,
  protein: 196,
  carbs: 287,
  fat: 72,
  water: 3000,
};
