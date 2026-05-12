export const MEALS = [
  {
    id: "pre_workout",
    name: "Pre-workout",
    time: "04:45",
    notifyMinutesBefore: 5,
    calories: 225,
    protein: 24,
    carbs: 27,
    fat: 1,
    ingredients: [
      "1 medium banana",
      "1 scoop whey protein (with water)"
    ],
    notes: "Keep it light — fuel without weighing you down."
  },
  {
    id: "post_workout",
    name: "Post-workout shake",
    time: "06:30",
    notifyMinutesBefore: 0,
    calories: 575,
    protein: 44,
    carbs: 63,
    fat: 16,
    ingredients: [
      "300 ml semi-skimmed milk",
      "1 scoop whey protein",
      "1 medium banana",
      "60 g oats",
      "15 g peanut butter",
      "5 g creatine monohydrate"
    ],
    notes: "Add creatine here. Blend or shake well."
  },
  {
    id: "lunch",
    name: "Lunch",
    time: "12:00",
    notifyMinutesBefore: 5,
    calories: 710,
    protein: 69,
    carbs: 78,
    fat: 14,
    ingredients: [
      "200 g cooked chicken breast",
      "250 g cooked rice",
      "150 g mixed veg",
      "10 g olive oil"
    ],
    notes: "Batch cooked — grab from fridge. Can swap rice for mash or pasta."
  },
  {
    id: "snack",
    name: "Afternoon snack",
    time: "15:00",
    notifyMinutesBefore: 0,
    calories: 355,
    protein: 30,
    carbs: 45,
    fat: 3,
    ingredients: [
      "250 g 0% Greek yoghurt",
      "40 g oats",
      "100 g mixed berries",
      "15 g honey"
    ],
    notes: "Great pre-dinner bridge. Keeps hunger in check."
  },
  {
    id: "dinner",
    name: "Dinner",
    time: "18:30",
    notifyMinutesBefore: 10,
    calories: 710,
    protein: 47,
    carbs: 71,
    fat: 24,
    ingredients: [
      "250 g lean beef mince chilli (5%)",
      "250 g cooked rice",
      "30 g grated cheddar",
      "100 g veg"
    ],
    notes: "Batch cooked chilli. Family can eat the same meal."
  }
];

export const DAILY_TOTALS = {
  calories: 2575,
  protein: 214,
  carbs: 284,
  fat: 58
};

export const WATER_GOAL_ML = 3000;
export const WATER_INCREMENT_ML = 250;
