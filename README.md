# Smart Grid AI Energy Optimizer ⚡🌱

> **Submitted to the TechHub Africa Hackathon 2026 Challenge ($1,000 USD Prize Pool)**  
> **Hosted on:** DoraHacks  
> **Track:** Electricity Efficiency & Renewable Grid Optimization  
> **Ecosystem & Stack:** IoT Edge, AI Time-Series Balancing, TypeScript ESM, Cloud Edge Greengrass  
> **Live Interactive Terminal:** [https://liutingqiu.github.io/smart-grid-ai-energy-optimizer/](https://liutingqiu.github.io/smart-grid-ai-energy-optimizer/)  
> **GitHub Repository:** [https://github.com/liutingqiu/smart-grid-ai-energy-optimizer](https://github.com/liutingqiu/smart-grid-ai-energy-optimizer)  
> **Author & Lead Engineer:** Tingqiu Liu (`@liutingqiu`, `tianqi689@gmail.com`)

---

## 🌟 Executive Summary & Problem Statement

Rapidly expanding urban centers across Africa and developing economies face persistent infrastructure constraints:
- Frequency instability and generation deficits frequently lead to unscheduled blackout rolling brownouts ("dumsor"), imposing heavy economic costs on commercial and industrial facilities.
- Existing municipal grids rely on manual dispatch decisions, delaying response to fluctuating solar photovoltaic production and leading to wasted renewable output or catastrophic frequency trips.

**Smart Grid AI Energy Optimizer** addresses this challenge directly:
1. **Real-Time Edge Telemetry Processing:** Monitors zone demand, BESS battery reserves, and grid frequency deviation with sub-100ms cycle time.
2. **Prioritized Renewable Dispatch Engine:** Programmatically allocates zero-marginal-cost solar and hydro first, buffering through battery storage before triggering expensive fossil-fuel municipal grid imports.
3. **Automated Deficit Load-Shedding Directives:** Detects imminent grid collapse and synthesizes localized, scheduled load-shedding plans to maintain frequency stability within nominal 50.00 Hz bands.

---

## 📊 Economic & Environmental Impact Model

For a commercial zone operating at $45\text{ MW}$ peak demand:
- **Renewable Micro-Arbitrage:** Displacing fossil-fuel peaker generation (\$0.14/kWh) with distributed solar and hydro (\$0.03/kWh) generates over **\$4,950/hr** in direct municipal fuel savings.
- **CO2 Emissions Abatement:** Reduces carbon emissions by **36,900 kg/hr** ($0.82\text{ kg CO2/kWh}$).

---

## 🧪 Automated Test Verification

```bash
node --test tests/grid.test.js
```

```text
✔ 1. optimizeZoneDispatch prioritizes 100% solar and renewables when sufficient (0.7ms)
✔ 2. Deficit triggers battery discharge and grid import balancing (0.1ms)
✔ 3. Extreme demand exceeding capacity triggers load shedding alert (0.1ms)
✔ 4. Catastrophic grid frequency excursion throws error (0.3ms)

ℹ pass 4
ℹ fail 0
```

---

## 🔗 Live Interactive Links

- **Interactive Visualizer:** [https://liutingqiu.github.io/smart-grid-ai-energy-optimizer/](https://liutingqiu.github.io/smart-grid-ai-energy-optimizer/)
- **GitHub Repository:** [https://github.com/liutingqiu/smart-grid-ai-energy-optimizer](https://github.com/liutingqiu/smart-grid-ai-energy-optimizer)
- **Official DoraHacks Challenge:** [TechHub Africa Hackathon 2026 Challenge ($1,000 USD)](https://dorahacks.io/hackathon/hackathon2026challenge/detail)
