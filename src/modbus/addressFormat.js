const status = ["line_number", "power_state", "stop_condition", "status_line"];
const data = [
  "pca",
  "target_output",
  "clocking",
  "output",
  "output_s1",
  "output_s2",
  "stop_time",
  "stop_time_s1",
  "stop_time_s2",
  "production_time",
  "production_time_s1",
  "production_time_s2",
  "dandori_time",
  "dandori_time_s1",
  "dandori_time_s2",
  "reject_setting",
  "reject_setting_s1",
  "reject_setting_s2",
  "dummy",
  "dummy_s1",
  "dummy_s2",
  "kanagata_shot",
  "kanagata_shot_s1",
  "kanagata_shot_s2",
  "machine_shot",
  "machine_shot_s1",
  "machine_shot_s2",
  "speed",
  "punch_cutting_shot",
  "die_cutting_shot",
  "punch_bending_shot",
  "die_bending_shot",
  "punch_bending_adj_shot",
  "die_bending_adj_shot",
  "menuchi_shot",
  "punch_cutting_shot_alarm1",
  "die_cutting_shot_alarm1",
  "punch_bending_shot_alarm1",
  "die_bending_shot_alarm1",
  "punch_bending_adj_shot_alarm1",
  "die_bending_adj_shot_alarm1",
  "menuchi_shot_alarm1",
  "punch_cutting_shot_alarm2",
  "die_cutting_shot_alarm2",
  "punch_bending_shot_alarm2",
  "die_bending_shot_alarm2",
  "punch_bending_adj_shot_alarm2",
  "die_bending_adj_shot_alarm2",
  "menuchi_shot_alarm2",
  "machine_shot",
  "kanagata_shot",
  "machine_shot_alarm1",
  "kanagata_shot_alarm1",
  "machine_shot_alarm2",
  "kanagata_shot_alarm2",
  "tsubushi_shot",
  "tsubushi_shot_alarm1",
  "tsubushi_shot_alarm2",
  "jig_cutting_shot",
  "jig_cutting_shot_alarm1",
  "jig_cutting_shot_alarm2"
];
const alarm = [
  "oil_level",
  "scrap_count_1",
  "punch_cutting_1",
  "die_cutting_1",
  "punch_bending_1",
  "die_bending_1",
  "punch_bending_adj_1",
  "die_bending_adj_1",
  "menuchi_1",
  "machine_shot_1",
  "kanagata_shot_1",
  "tsubushi_shot_1",
  "jig_cutting_shot_1"
];

const addressPolling = [
  // LINE 1
  {
    startAddress: 50000,
    quantity: 4,
    machine: "stamping_line_1",
    type: "16bit",
    name: status
  },
  {
    startAddress: 50004,
    quantity: 61,
    machine: "stamping_line_1",
    type: "32bit",
    name: data
  },
  {
    startAddress: 50150,
    quantity: 13,
    machine: "stamping_line_1",
    type: "16bit",
    name: alarm
  },
  // LINE 2
  {
    startAddress: 50600,
    quantity: 4,
    machine: "stamping_line_2",
    type: "16bit",
    name: status
  },
  {
    startAddress: 50604,
    quantity: 61,
    machine: "stamping_line_2",
    type: "32bit",
    name: data
  },
  {
    startAddress: 50750,
    quantity: 13,
    machine: "stamping_line_2",
    type: "16bit",
    name: alarm
  },
  // LINE 3
  {
    startAddress: 50900,
    quantity: 4,
    machine: "stamping_line_3",
    type: "16bit",
    name: status
  },
  {
    startAddress: 50904,
    quantity: 61,
    machine: "stamping_line_3",
    type: "32bit",
    name: data
  },
  {
    startAddress: 51050,
    quantity: 13,
    machine: "stamping_line_3",
    type: "16bit",
    name: alarm
  },
  // LINE 4
  {
    startAddress: 51200,
    quantity: 4,
    machine: "stamping_line_4",
    type: "16bit",
    name: status
  },
  {
    startAddress: 51204,
    quantity: 61,
    machine: "stamping_line_4",
    type: "32bit",
    name: data
  },
  {
    startAddress: 51350,
    quantity: 13,
    machine: "stamping_line_4",
    type: "16bit",
    name: alarm
  },
  // LINE 7
  {
    startAddress: 52100,
    quantity: 4,
    machine: "stamping_line_7",
    type: "16bit",
    name: status
  },
  {
    startAddress: 52104,
    quantity: 61,
    machine: "stamping_line_7",
    type: "32bit",
    name: data
  },
  {
    startAddress: 52250,
    quantity: 13,
    machine: "stamping_line_7",
    type: "16bit",
    name: alarm
  },
  // LINE 8
  {
    startAddress: 50300,
    quantity: 4,
    machine: "stamping_line_8",
    type: "16bit",
    name: status
  },
  {
    startAddress: 50304,
    quantity: 61,
    machine: "stamping_line_8",
    type: "32bit",
    name: data
  },
  {
    startAddress: 50450,
    quantity: 13,
    machine: "stamping_line_8",
    type: "16bit",
    name: alarm
  },
  // LINE 10
  {
    startAddress: 52700,
    quantity: 4,
    machine: "stamping_line_10",
    type: "16bit",
    name: status
  },
  {
    startAddress: 52704,
    quantity: 61,
    machine: "stamping_line_10",
    type: "32bit",
    name: data
  },
  {
    startAddress: 53150,
    quantity: 13,
    machine: "stamping_line_10",
    type: "16bit",
    name: alarm
  },
];

module.exports = { addressPolling };