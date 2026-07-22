// ===============================
// Italian Travel Companion App
// ===============================

// ---- CATEGORY DATA ----
const categories = {
  airports: {
    name: "Airports",
    words: [
      { it: "biglietto", en: "ticket" },
      { it: "passaporto", en: "passport" },
      { it: "bagaglio", en: "luggage" },
      { it: "imbarco", en: "boarding" },
      { it: "uscita", en: "exit" }
    ],
    scenarios: [
      {
        title: "Checking In",
        dialogue: [
          { speaker: "Staff", text: "Buongiorno, il suo passaporto per favore." },
          { speaker: "You", text: "Ecco il mio passaporto." }
        ]
      }
    ]
  },

  hotels: {
    name: "Hotels",
    words: [
      { it: "prenotazione", en: "reservation" },
      { it: "chiave", en: "key" },
      { it: "camera", en: "room" },
      { it: "colazione", en: "breakfast" },
      { it: "ascensore", en: "elevator" }
    ],
    scenarios: [
      {
        title: "Checking In",
        dialogue: [
          { speaker: "You", text: "Buonasera, ho una prenotazione a nome Samil." },
          { speaker: "Staff", text: "Perfetto, la sua camera è la 305." }
        ]
      }
    ]
  },

  public_transport: {
    name: "Public Transportation",
    words: [
      { it: "autobus", en: "bus" },
      { it: "biglietteria", en: "ticket office" },
      { it: "fermata", en: "stop" },
      { it: "treno", en: "train" },
      { it: "orario", en: "schedule" }
    ],
    scenarios: [
      {
        title: "Buying a Ticket",
        dialogue: [
          { speaker: "You", text: "Un biglietto per favore." },
          { speaker: "Staff", text: "Certo, dove deve andare?" }
        ]
      }
    ]
  },

  restaurants: {
    name: "Restaurants",
    words: [
      { it: "menu", en: "menu" },
      { it: "acqua", en: "water" },
      { it: "conto", en: "bill" },
      { it: "prenotare", en: "to reserve" },
      { it: "cameriere", en: "waiter" }
    ],
    scenarios: [
      {
        title: "Ordering Food",
        dialogue: [
          { speaker: "Waiter", text: "Cosa desidera ordinare?" },
          { speaker: "You", text: "Vorrei la pasta, per favore." }
        ]
      }
    ]
  },

  museums: {
    name: "Museums",
    words: [
      { it: "biglietto", en: "ticket" },
      { it: "guida", en: "guide" },
