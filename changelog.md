# Changelog

All notable changes to this project will be documented in this file

---

# [v1.0.1] - 2025-07-24

### Changed

- Update change formula calculation query for sogo kadoritsu
  (total production time) / (24 x 60 x 30)
- Update change formula calcultaion query for sugyou kadoritsu
  production time / (production time + dandori time + stop time)

### Fixed

- Fix query model for history reset kanagata part by adding filter to id_kanagata in query model

# [v1.0.0] - Initial Stable Release

Date: 2025-07-22

This release marks the first stable version of the **be-stamping** built with **NodeJS, ExpressJS, MySQL, KnexJS, Modbus, MCProtocol**.

### Features

- ⚙ **PLC Polling** : Polling data from PLC using jsmodbus for resource data.
- 📅 **Production Plan** : CRUD production plan and visualize with calendar timeline.
- 📝 **Master Data** : CRUD for management master data such as machine, product, pca data.
- 📊 **Reporting Chart** : Graphic visualization to report production data with daily,monthly, yearly timeline.
- 🕔 **Realtime Production & Shot Monitoring** : Dashboard for realtime monitoring line status & kanagata shot

---
