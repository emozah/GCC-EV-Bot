// @ts-nocheck
import { DurableObject } from "cloudflare:workers";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScFydrFp3aOtv_DQ2J-SFETbCWh_RxYQYiivj7drfUe8ni0vA/viewform?usp=header";
var COUNTRIES = {
  "\u{1F1F8}\u{1F1E6} \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629": "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629",
  "\u{1F1E6}\u{1F1EA} \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A": "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A",
  "\u{1F1F6}\u{1F1E6} \u0642\u0637\u0631": "\u0642\u0637\u0631",
  "\u{1F1F0}\u{1F1FC} \u0627\u0644\u0643\u0648\u064A\u062A": "\u0627\u0644\u0643\u0648\u064A\u062A",
  "\u{1F1E7}\u{1F1ED} \u0627\u0644\u0628\u062D\u0631\u064A\u0646": "\u0627\u0644\u0628\u062D\u0631\u064A\u0646",
  "\u{1F1F4}\u{1F1F2} \u0639\u064F\u0645\u0627\u0646": "\u0639\u0645\u0627\u0646"
};
var MAIN_MENU = {
  keyboard: [
    [{ text: "🗺️ تخطيط الرحلة" }, { text: "📍 أقرب محطة", request_location: true }],
    [{ text: "🔋 نوع الشاحن" }, { text: "🌍 البحث عن محطة" }],
    [{ text: "🛠️ الخدمات والبلاغات" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var CHARGER_TYPE_MENU = {
  keyboard: [
    [{ text: "⚡ شحن سريع DC" }, { text: "🔌 شحن عادي AC" }],
    [{ text: "🔋 جميع أنواع الشحن" }, { text: "📍 مشاركة موقعي", request_location: true }],
    [{ text: "🏠 القائمة الرئيسية" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var SEARCH_MENU = {
  keyboard: [
    [{ text: "🌍 البحث حسب الدولة" }, { text: "🔍 البحث عن محطة" }],
    [{ text: "📍 مشاركة موقعي", request_location: true }, { text: "🏠 القائمة الرئيسية" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var SERVICES_MENU = {
  keyboard: [
    [{ text: "➕ إضافة محطة" }, { text: "🛠️ إبلاغ عن مشكلة" }],
    [{ text: "💎 عضويتي والاشتراكات" }, { text: "🎁 نقاطي ودعواتي" }],
    [{ text: "📢 تحديثات واتساب" }, { text: "🏠 القائمة الرئيسية" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var WHATSAPP_UPDATES_URL = "https://chat.whatsapp.com/HK2uJncoGhrCUIPHgcZ5tA?s=cl&p=a&mlu=4&ilr=4&iam=2";
var TRIP_POINT_MENU = {
  keyboard: [
    [{ text: "\u{1F4CD} \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0645\u0648\u0642\u0639", request_location: true }, { text: "\u{1F50D} \u0643\u062A\u0627\u0628\u0629 \u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629" }],
    [{ text: "\u{1F519} \u0631\u062C\u0648\u0639" }, { text: "\u{1F3E0} \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var TRIP_MODE_MENU = {
  keyboard: [
    [{ text: "\u26A1 \u0634\u062D\u0646 \u0633\u0631\u064A\u0639 DC \u0641\u0642\u0637" }],
    [{ text: "\u{1F50C} \u0634\u062D\u0646 \u0639\u0627\u062F\u064A AC \u0641\u0642\u0637" }],
    [{ text: "\u{1F50B} \u062C\u0645\u064A\u0639 \u0645\u062D\u0637\u0627\u062A \u0627\u0644\u0634\u062D\u0646" }],
    [{ text: "\u{1F519} \u0631\u062C\u0648\u0639" }, { text: "\u{1F3E0} \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
var TRIP_DISPLAY_MENU = { keyboard: [[{text:"🎯 محطات الشحن حسب البطارية"}],[{text:"⚡ جميع المحطات على الطريق"}],[{text:"🏠 القائمة الرئيسية"}]], resize_keyboard:true, is_persistent:true };
function tripBatterySummary(trip, km) {
  const pct=Number(trip.battery_percent), cap=Number(trip.battery_capacity), use=Number(trip.battery_consumption);
  if (!(pct>0&&pct<=100&&cap>=5&&cap<=250&&use>=5&&use<=80)) return null;
  const perKm=use/cap, finish=pct-km*perKm, target=25, targetKm=(pct-target)/perKm, reserveKm=(pct-25)/perKm;
  return {pct,cap,use,finish,target,targetKm,reserveKm,perKm,km};
}
function tripDisplayItems(data) {
  const items = Array.isArray(data) ? data : (data.items || []);
  if (Array.isArray(data) || data.view !== "BATTERY" || !data.battery) return items;
  const b = data.battery;
  if (b.finish >= 20) return [];
  const eligible = items.filter(item => Number.isFinite(Number(item.km))).map(item => {
    const distance = Number(item.km);
    const estimatedBattery = b.pct - distance * b.perKm;
    return { ...item, estimatedBattery, distanceFromStart: distance };
  }).filter(item => item.estimatedBattery >= 20 && item.distanceFromStart >= 0);
  return eligible.sort((a, c) => {
    const scoreA = Math.abs(a.distanceFromStart - b.targetKm);
    const scoreC = Math.abs(c.distanceFromStart - b.targetKm);
    return scoreA - scoreC || a.distanceFromStart - c.distanceFromStart;
  });
}
var COUNTRY_MENU = {
  keyboard: [
    [{ text: "🇸🇦 السعودية" }, { text: "🇦🇪 الإمارات" }],
    [{ text: "🇶🇦 قطر" }, { text: "🇰🇼 الكويت" }],
    [{ text: "🇧🇭 البحرين" }, { text: "🇴🇲 عُمان" }],
        [{ text: "🏠 القائمة الرئيسية" }]
  ],
  resize_keyboard: true,
  is_persistent: true
};
async function telegram(token, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram HTTP ${response.status}: ${errorBody}`);
  }
  const data = await response.json();
  if (!data.ok) throw new Error(`Telegram API: ${data.description || method}`);
  return data;
}
__name(telegram, "telegram");
async function reply(env, chat, text, markup = MAIN_MENU) {
  return telegram(env.BOT_TOKEN, "sendMessage", {
    chat_id: chat, text, reply_markup: markup, disable_web_page_preview: true
  });
}
__name(reply, "reply");
async function saveState(db, chat, country, mode) {
  await db.prepare(`INSERT INTO user_search_state (chat_id, country, charging_mode, page_offset, updated_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP) ON CONFLICT(chat_id) DO UPDATE SET country = excluded.country, charging_mode = excluded.charging_mode, page_offset = 0, last_latitude = NULL, last_longitude = NULL, search_active = 0, search_query = NULL, updated_at = CURRENT_TIMESTAMP`).bind(String(chat), country, mode).run();
}
__name(saveState, "saveState");
async function getState(db, chat) {
  return await db.prepare(`SELECT country, charging_mode, last_latitude, last_longitude, page_offset FROM user_search_state WHERE chat_id = ?`).bind(String(chat)).first() || { country: null, charging_mode: "ALL", last_latitude: null, last_longitude: null, page_offset: 0 };
}
__name(getState, "getState");
async function saveUserLocation(db, chat, lat, lon) {
  await db.prepare(`INSERT INTO user_search_state (chat_id, last_latitude, last_longitude, page_offset) VALUES (?, ?, ?, 0) ON CONFLICT(chat_id) DO UPDATE SET last_latitude = excluded.last_latitude, last_longitude = excluded.last_longitude, page_offset = 0, search_active = 0, search_query = NULL, updated_at = CURRENT_TIMESTAMP`).bind(String(chat), lat, lon).run();
}
__name(saveUserLocation, "saveUserLocation");
function distanceKm(lat1, lon1, lat2, lon2) {
  const rad = (value) => value * Math.PI / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
__name(distanceKm, "distanceKm");
function matchesMode(station, mode) {
  if (mode === "ALL") return true;
  const type = String(station.charger_type || "").toLowerCase();
  if (mode === "DC") return /dc|سريع|fast/.test(type);
  if (mode === "AC") return /ac|عادي|normal|slow/.test(type) && !/dc|سريع|fast/.test(type);
  return false;
}
__name(matchesMode, "matchesMode");
function isEligible(station) {
  const status = String(station.status || "").toLowerCase();
  if (/تحت الإنشاء|قيد الإنشاء|under construction|planned|مخطط/.test(status)) return false;
  if (/معطل|متوقف عن العمل|out of service|permanently closed/.test(status)) return false;
  const lat = Number(station.latitude), lon = Number(station.longitude);
  return station.latitude !== null && station.longitude !== null && station.latitude !== "" && station.longitude !== "" && Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
__name(isEligible, "isEligible");
async function findPage(db, lat, lon, state, offset = 0) {
  // جلب جميع المحطات بطريقة بسيطة (بدون استعلام معقد)
  const query = db.prepare("SELECT * FROM stations");
  const data = await query.all();
  
  // تصفية المحطات حسب الدولة ونوع الشاحن برمجياً
  const ordered = (data.results || [])
    .filter(s => matchesMode(s, state.charging_mode))
    .filter(isEligible)
    .map(s => ({
      ...s,
      km: distanceKm(lat, lon, Number(s.latitude), Number(s.longitude))
    }))
    .sort((a, b) => a.km - b.km);
    
  const selected = ordered.slice(offset, offset + 4);
  return { 
    stations: selected.slice(0, 3), 
    hasMore: selected.length > 3 
  };
}
__name(findPage, "findPage");
function normalizeSearch(value) {
  return String(value ?? "").toLowerCase().normalize("NFKC").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآٱ]/g, "\u0627").replace(/ى/g, "\u064A").replace(/ة/g, "\u0647").replace(/ـ/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
__name(normalizeSearch, "normalizeSearch");
async function searchStations(db, searchText, offset = 0) {
  const keyword = normalizeSearch(String(searchText || "").slice(0, 100));
  if (!keyword) return { stations: [], hasMore: false };
  const data = await db.prepare("SELECT * FROM stations").all();
  const terms = keyword.split(/\s+/).filter(Boolean);
  const matched = (data.results || []).filter(isEligible).filter((station) => {
    const fields = [station.id, station.station_id, station.station_number, station.name, station.operator, station.country, station.description, station.city, station.address];
    const searchableText = normalizeSearch(fields.filter(v => v != null).join(" "));
    return terms.every(term => searchableText.includes(term));
  });
  matched.sort((a, b) => {
    const exactMatch = (station) => normalizeSearch(station.id) === keyword || normalizeSearch(station.station_id) === keyword || normalizeSearch(station.station_number) === keyword;
    return Number(exactMatch(b)) - Number(exactMatch(a)) || String(a.name || "").localeCompare(String(b.name || ""), "ar");
  });
  const selected = matched.slice(offset, offset + 4);
  return { stations: selected.slice(0, 3), hasMore: selected.length > 3 };
}
__name(searchStations, "searchStations");
function stationText(s, index) {
  const display = (value) => {
    const text = String(value ?? "").trim();
    if (!text || /^(null|undefined|nan|n\/a|unknown)$/i.test(text)) return "\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641";
    return text;
  };
  return [
    `${index + 1}. \u26A1 ${display(s.name)}`,
    `\u200F\u{1F194} \u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u0645\u062D\u0637\u0629: ${display(s.station_id ?? s.id)}\u200F`,
    `\u{1F30D} \u0627\u0644\u062F\u0648\u0644\u0629: ${display(s.country)}`,
    `\u{1F3E2} \u0627\u0644\u0645\u0634\u063A\u0651\u0644: ${display(s.operator)}`,
    `\u{1F50C} \u0646\u0648\u0639 \u0627\u0644\u0634\u062D\u0646: ${display(s.charger_type)}`,
    `\u26A1 \u0627\u0644\u0642\u062F\u0631\u0629: ${display(s.power_kw)}`,
    `\u{1F50B} \u0646\u0648\u0639 \u0627\u0644\u0645\u0648\u0635\u0644: ${display(s.connector)}`,
    `\u{1F9F5} \u062A\u0648\u0641\u0631 \u0627\u0644\u0643\u064A\u0628\u0644: ${display(s.cable_available)}`,
    s.station_number ? `\u{1F522} \u0631\u0642\u0645 \u0627\u0644\u0645\u062D\u0637\u0629: ${s.station_number}` : "",
    `\u{1F4CB} \u0627\u0644\u062D\u0627\u0644\u0629: ${display(s.status)}`,
    Number.isFinite(s.km) ? `\u{1F4CF} \u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0628\u062E\u0637 \u0645\u0633\u062A\u0642\u064A\u0645: ${s.km.toFixed(1)} \u0643\u0645` : ""
  ].filter(Boolean).join("\n");
}
__name(stationText, "stationText");
function directionsKeyboard(stations, offset = 0, hasMore = false, morePrefix = "more_stations") {
  const buttons = stations.map((s, i) => [{
    text: `\u{1F5FA}\uFE0F \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u0645\u062D\u0637\u0629 ${offset + i + 1}`,
    url: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(`${s.latitude},${s.longitude}`)
  }]);
  if (hasMore) {
    buttons.push([{ text: "\u26A1 \u0639\u0631\u0636 3 \u0645\u062D\u0637\u0627\u062A \u0623\u062E\u0631\u0649", callback_data: `${morePrefix}:${offset + 3}` }]);
  }
  return { inline_keyboard: buttons };
}
__name(directionsKeyboard, "directionsKeyboard");
function pageMessage(stations, offset, heading) {
  const content = stations.map((s, i) => stationText(s, offset + i)).join("\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n");
  const hasDistance = stations.some(s => Number.isFinite(s.km));
  const notice = hasDistance ? "\n\n\u062A\u0646\u0628\u064A\u0647: \u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062A \u0628\u062E\u0637 \u0645\u0633\u062A\u0642\u064A\u0645 \u0648\u0644\u064A\u0633\u062A \u0645\u0633\u0627\u0641\u0627\u062A \u0642\u064A\u0627\u062F\u0629. \u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u0629 \u0627\u0644\u0634\u0627\u062D\u0646 \u0642\u0628\u0644 \u0627\u0644\u0630\u0647\u0627\u0628." : "\n\n\u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u0629 \u0627\u0644\u0634\u0627\u062D\u0646 \u0642\u0628\u0644 \u0627\u0644\u0630\u0647\u0627\u0628.";
  return `${heading}\n\n${content}${notice}`;
}
__name(pageMessage, "pageMessage");
async function ensureTripTable(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS trip_planner_state (chat_id TEXT PRIMARY KEY, step TEXT NOT NULL, start_lat REAL, start_lon REAL, start_name TEXT, end_lat REAL, end_lon REAL, end_name TEXT, mode TEXT DEFAULT 'ALL', stage TEXT, battery_percent REAL, battery_capacity REAL, battery_consumption REAL, display_mode TEXT DEFAULT 'ALL', updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run();
  const info = await db.prepare("PRAGMA table_info(trip_planner_state)").all();
  const existing = new Set((info.results || []).map(column => column.name));
  const additions = { stage: "TEXT", battery_percent: "REAL", battery_capacity: "REAL", battery_consumption: "REAL", display_mode: "TEXT DEFAULT 'ALL'" };
  for (const [column, definition] of Object.entries(additions)) {
    if (!existing.has(column)) {
      try { await db.prepare(`ALTER TABLE trip_planner_state ADD COLUMN ${column} ${definition}`).run(); }
      catch (error) { if (!/duplicate column name/i.test(String(error?.message || error))) throw error; }
    }
  }
}
__name(ensureTripTable, "ensureTripTable");
async function getTrip(db, chat) {
  await ensureTripTable(db);
  return db.prepare("SELECT * FROM trip_planner_state WHERE chat_id = ?").bind(String(chat)).first();
}
__name(getTrip, "getTrip");
async function setTrip(db, chat, values) {
  await ensureTripTable(db);
  const allowed = ["step","start_lat","start_lon","start_name","end_lat","end_lon","end_name","mode","battery_percent","battery_capacity","battery_consumption","display_mode"];
  const keys = Object.keys(values).filter(key => allowed.includes(key));
  if (!keys.length) return;
  const step = String(values.step || "start_choose");
  await db.prepare(`INSERT INTO trip_planner_state (chat_id, stage, step) VALUES (?, ?, ?) ON CONFLICT(chat_id) DO NOTHING`).bind(String(chat), step, step).run();
  const updateKeys = keys.includes("step") ? [...keys, "stage"] : keys;
  const updateValues = keys.includes("step") ? [...keys.map(key => values[key]), step] : keys.map(key => values[key]);
  const result = await db.prepare(`UPDATE trip_planner_state SET ${updateKeys.map(key => key + " = ?").join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(...updateValues, String(chat)).run();
  if ((result.meta?.changes ?? 0) < 1) throw new Error("TRIP_STATE_SAVE_FAILED");
}
__name(setTrip, "setTrip");
async function clearTrip(db, chat) {
  await ensureTripTable(db);
  await db.prepare("DELETE FROM trip_planner_state WHERE chat_id = ?").bind(String(chat)).run();
}
__name(clearTrip, "clearTrip");
function validPoint(lat, lon) { return Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180; }
__name(validPoint, "validPoint");
function pointPrompt(start) { return start ? "\u{1F6A9} \u062D\u062F\u062F \u0646\u0642\u0637\u0629 \u0627\u0644\u0627\u0646\u0637\u0644\u0627\u0642:\n\n\u{1F4CD} \u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0648\u0642\u0639\u060C \u0623\u0648 \u{1F50D} \u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629." : "\u{1F3C1} \u062D\u062F\u062F \u0648\u062C\u0647\u0629 \u0627\u0644\u0631\u062D\u0644\u0629:\n\n\u{1F4CD} \u0623\u0631\u0633\u0644 \u0645\u0648\u0642\u0639 \u0627\u0644\u0648\u062C\u0647\u0629\u060C \u0623\u0648 \u{1F50D} \u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u062F\u064A\u0646\u0629."; }
__name(pointPrompt, "pointPrompt");
async function startTrip(env, chat) {
  await batteryEnsureTables(env.DB);
  await env.DB.prepare("DELETE FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).run();
  await clearTrip(env.DB, chat);
  await clearTripResults(env.DB, chat);
  await setTrip(env.DB, chat, { step: "start_choose" });
  await reply(env, chat, pointPrompt(true), TRIP_POINT_MENU);
}
__name(startTrip, "startTrip");
var GCC_CITIES = [
  ["\u0627\u0644\u0631\u064A\u0627\u0636|riyadh", 24.7136, 46.6753], ["\u0627\u0644\u062E\u0628\u0631|khobar|al khobar", 26.2794, 50.2083], ["\u0627\u0644\u062F\u0645\u0627\u0645|dammam", 26.4207, 50.0888], ["\u0627\u0644\u0638\u0647\u0631\u0627\u0646|dhahran", 26.2886, 50.1139], ["\u0627\u0644\u0642\u0637\u064A\u0641|qatif", 26.5652, 50.0089], ["\u0627\u0644\u0627\u062D\u0633\u0627\u0621|\u0627\u0644\u0627\u062D\u0633\u0627\u0621|\u0627\u0644\u0647\u0641\u0648\u0641|hofuf|al ahsa", 25.3647, 49.5876], ["\u0627\u0644\u062C\u0628\u064A\u0644|jubail", 27.0046, 49.646], ["\u0631\u0627\u0633 \u062A\u0646\u0648\u0631\u0629|ras tanura", 26.6435, 50.159], ["\u0645\u0643\u0647|\u0645\u0643\u0629|makkah|mecca", 21.3891, 39.8579], ["\u062C\u062F\u0647|\u062C\u062F\u0629|jeddah", 21.5433, 39.1728], ["\u0627\u0644\u0645\u062F\u064A\u0646\u0647|\u0627\u0644\u0645\u062F\u064A\u0646\u0629|\u0627\u0644\u0645\u062F\u064A\u0646\u0647 \u0627\u0644\u0645\u0646\u0648\u0631\u0647|medina|madinah", 24.5247, 39.5692], ["\u0627\u0644\u0637\u0627\u064A\u0641|\u0627\u0644\u0637\u0627\u0626\u0641|taif", 21.2703, 40.4158], ["\u064A\u0646\u0628\u0639|yanbu", 24.0895, 38.0618], ["\u062A\u0628\u0648\u0643|tabuk", 28.3838, 36.555], ["\u062D\u0627\u064A\u0644|\u062D\u0627\u0626\u0644|hail", 27.5114, 41.7208], ["\u0628\u0631\u064A\u062F\u0647|\u0628\u0631\u064A\u062F\u0629|buraydah", 26.3592, 43.9818], ["\u0639\u0646\u064A\u0632\u0647|\u0639\u0646\u064A\u0632\u0629|unaizah", 26.0906, 43.975], ["\u0627\u0628\u0647\u0627|\u0623\u0628\u0647\u0627|abha", 18.2465, 42.5117], ["\u062E\u0645\u064A\u0633 \u0645\u0634\u064A\u0637|khamis mushait", 18.3064, 42.7292], ["\u062C\u0627\u0632\u0627\u0646|\u062C\u064A\u0632\u0627\u0646|jazan|jizan", 16.8892, 42.5511], ["\u0646\u062C\u0631\u0627\u0646|najran", 17.565, 44.2289], ["\u0627\u0644\u0628\u0627\u062D\u0647|\u0627\u0644\u0628\u0627\u062D\u0629|al baha", 20.0129, 41.4677], ["\u0633\u0643\u0627\u0643\u0627|sakaka", 29.9697, 40.2064], ["\u0639\u0631\u0639\u0631|arar", 30.9753, 41.0381], ["\u062D\u0641\u0631 \u0627\u0644\u0628\u0627\u0637\u0646|hafr al batin", 28.4328, 45.9708], ["\u0627\u0644\u062E\u0641\u062C\u064A|khafji", 28.4392, 48.4913], ["\u0627\u0644\u062F\u0648\u0627\u062F\u0645\u064A|dawadmi", 24.5077, 44.3924], ["\u0627\u0644\u062F\u0648\u062D\u0647|\u0627\u0644\u062F\u0648\u062D\u0629|doha", 25.2854, 51.531], ["\u0627\u0644\u0631\u064A\u0627\u0646|al rayyan", 25.2919, 51.4244], ["\u0627\u0644\u0648\u0643\u0631\u0629|\u0627\u0644\u0648\u0643\u0640\u0631\u0629|al wakrah", 25.1715, 51.6034], ["\u0627\u0644\u062E\u0648\u0631|al khor", 25.6839, 51.5058], ["\u0644\u0648\u0633\u064A\u0644|lusail", 25.42, 51.49], ["\u0627\u0628\u0648 \u0633\u0645\u0631\u0629|\u0623\u0628\u0648 \u0633\u0645\u0631\u0629|abu samra", 24.7445, 50.8476], ["\u0627\u0644\u0643\u0648\u064A\u062A|\u0645\u062F\u064A\u0646\u0647 \u0627\u0644\u0643\u0648\u064A\u062A|\u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0643\u0648\u064A\u062A|kuwait city", 29.3759, 47.9774], ["\u0627\u0644\u062C\u0647\u0631\u0627\u0621|jahra", 29.3375, 47.6581], ["\u0627\u0644\u0627\u062D\u0645\u062F\u064A|\u0627\u0644\u0623\u062D\u0645\u062F\u064A|ahmadi", 29.0769, 48.0839], ["\u0627\u0644\u0641\u062D\u064A\u062D\u064A\u0644|fahaheel", 29.0825, 48.1303], ["\u0627\u0644\u0633\u0627\u0644\u0645\u064A\u0647|\u0627\u0644\u0633\u0627\u0644\u0645\u064A\u0629|salmiya", 29.3339, 48.0761], ["\u062D\u0648\u0644\u064A|hawally", 29.3375, 48.0285], ["\u0627\u0644\u0641\u0631\u0648\u0627\u0646\u064A\u0647|\u0627\u0644\u0641\u0631\u0648\u0627\u0646\u064A\u0629|farwaniya", 29.2775, 47.9586], ["\u0627\u0644\u0645\u0646\u0627\u0645\u0647|\u0627\u0644\u0645\u0646\u0627\u0645\u0629|manama", 26.2235, 50.5876], ["\u0627\u0644\u0645\u062D\u0631\u0642|muharraq", 26.2572, 50.6119], ["\u0627\u0644\u0631\u0641\u0627\u0639|riffa", 26.13, 50.555], ["\u0645\u062F\u064A\u0646\u0647 \u0639\u064A\u0633\u0649|\u0645\u062F\u064A\u0646\u0629 \u0639\u064A\u0633\u0649|isa town", 26.1736, 50.5478], ["\u0633\u062A\u0631\u0647|\u0633\u062A\u0631\u0629|sitra", 26.1547, 50.621], ["\u062D\u0645\u062F|\u0645\u062F\u064A\u0646\u0647 \u062D\u0645\u062F|\u0645\u062F\u064A\u0646\u0629 \u062D\u0645\u062F|hamad town", 26.1153, 50.507], ["\u062F\u0628\u064A|dubai", 25.2048, 55.2708], ["\u0627\u0628\u0648\u0638\u0628\u064A|\u0623\u0628\u0648\u0638\u0628\u064A|abu dhabi", 24.4539, 54.3773], ["\u0627\u0644\u0634\u0627\u0631\u0642\u0647|\u0627\u0644\u0634\u0627\u0631\u0642\u0629|sharjah", 25.3463, 55.4209], ["\u0639\u062C\u0645\u0627\u0646|ajman", 25.4052, 55.5136], ["\u0627\u0645 \u0627\u0644\u0642\u064A\u0648\u064A\u0646|\u0623\u0645 \u0627\u0644\u0642\u064A\u0648\u064A\u0646|umm al quwain", 25.5647, 55.5552], ["\u0631\u0627\u0633 \u0627\u0644\u062E\u064A\u0645\u0647|\u0631\u0623\u0633 \u0627\u0644\u062E\u064A\u0645\u0629|ras al khaimah", 25.7895, 55.9432], ["\u0627\u0644\u0641\u062C\u064A\u0631\u0647|\u0627\u0644\u0641\u062C\u064A\u0631\u0629|fujairah", 25.1288, 56.3265], ["\u0627\u0644\u0639\u064A\u0646|al ain", 24.2075, 55.7447], ["\u062E\u0648\u0631\u0641\u0643\u0627\u0646|\u062E\u0648\u0631 \u0641\u0643\u0627\u0646|khor fakkan", 25.3313, 56.341], ["\u0643\u0644\u0628\u0627\u0621|kalba", 25.0743, 56.3553], ["\u0645\u0633\u0642\u0637|muscat", 23.588, 58.3829], ["\u0627\u0644\u0633\u064A\u0628|seeb", 23.6703, 58.1891], ["\u0645\u0637\u0631\u062D|muttrah", 23.6167, 58.5667], ["\u0635\u062D\u0627\u0631|sohar|suhar", 24.3475, 56.7094], ["\u0635\u0644\u0627\u0644\u0647|\u0635\u0644\u0627\u0644\u0629|salalah", 17.0194, 54.0897], ["\u0646\u0632\u0648\u0649|nizwa", 22.9333, 57.5333], ["\u0635\u0648\u0631|sur oman|sur", 22.5667, 59.5289], ["\u0627\u0644\u0628\u0631\u064A\u0645\u064A|buraimi", 24.25, 55.7931], ["\u0639\u0628\u0631\u064A|ibri", 23.2257, 56.5157], ["\u0627\u0644\u0631\u0633\u062A\u0627\u0642|rustaq", 23.3908, 57.4244], ["\u062E\u0635\u0628|khasab", 26.1799, 56.2477], ["\u0627\u0644\u062F\u0642\u0645|duqm", 19.65, 57.7]
];
function isGccPoint(lat, lon) { return validPoint(lat, lon) && lat >= 16 && lat <= 33 && lon >= 34 && lon <= 61; }
__name(isGccPoint, "isGccPoint");
var GCC_COUNTRY_CENTERS = [["\u0642\u0637\u0631|qatar|state of qatar", "\u0642\u0637\u0631 (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0627\u0644\u062F\u0648\u062D\u0629)", 25.2854, 51.531], ["\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629|\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629|saudi arabia", "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0627\u0644\u0631\u064A\u0627\u0636)", 24.7136, 46.6753], ["\u0627\u0644\u0627\u0645\u0627\u0631\u0627\u062A|\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A|\u0627\u0644\u0627\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u0629|\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u0629|united arab emirates|uae", "\u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0623\u0628\u0648\u0638\u0628\u064A)", 24.4539, 54.3773], ["\u0627\u0644\u0643\u0648\u064A\u062A|kuwait", "\u0627\u0644\u0643\u0648\u064A\u062A (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0645\u062F\u064A\u0646\u0629 \u0627\u0644\u0643\u0648\u064A\u062A)", 29.3759, 47.9774], ["\u0627\u0644\u0628\u062D\u0631\u064A\u0646|bahrain", "\u0627\u0644\u0628\u062D\u0631\u064A\u0646 (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0627\u0644\u0645\u0646\u0627\u0645\u0629)", 26.2235, 50.5876], ["\u0639\u0645\u0627\u0646|\u0633\u0644\u0637\u0646\u0629 \u0639\u0645\u0627\u0646|oman", "\u0639\u064F\u0645\u0627\u0646 (\u0645\u0631\u0643\u0632 \u062A\u0642\u0631\u064A\u0628\u064A: \u0645\u0633\u0642\u0637)", 23.588, 58.3829]];
var GCC_TRAVEL_LANDMARKS = [["\u0645\u0646\u0641\u0630 \u0627\u0644\u0628\u0637\u062D\u0627\u0621|\u0627\u0644\u0628\u0637\u062D\u0627\u0621|\u0645\u0646\u0641\u0630 \u0627\u0644\u0628\u062D\u0637\u0627\u0621|\u0627\u0644\u0628\u062D\u0637\u0627\u0621|al batha|al batha border crossing|al batha border post|batha border|al bat'ha", "\u0645\u0646\u0641\u0630 \u0627\u0644\u0628\u0637\u062D\u0627\u0621 (\u0645\u0648\u0642\u0639 \u062A\u0642\u0631\u064A\u0628\u064A)", 24.122764, 51.58176], ["\u0645\u0646\u0641\u0630 \u0627\u0644\u063A\u0648\u064A\u0641\u0627\u062A|\u0627\u0644\u063A\u0648\u064A\u0641\u0627\u062A|al ghuwaifat|al ghuwaifat border post|al ghuwaifat border crossing|ghuwaifat|al ghuweifat", "\u0645\u0646\u0641\u0630 \u0627\u0644\u063A\u0648\u064A\u0641\u0627\u062A (\u0645\u0648\u0642\u0639 \u062A\u0642\u0631\u064A\u0628\u064A)", 24.1281, 51.61801], ["\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F|\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0627\u0644\u062F\u0648\u0644\u064A|king fahd international airport|king fahd airport|dammam airport|oedf|dmm airport", "\u0645\u0637\u0627\u0631 \u0627\u0644\u0645\u0644\u0643 \u0641\u0647\u062F \u0627\u0644\u062F\u0648\u0644\u064A (\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0637\u0627\u0631 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A)", 26.471194, 49.798583]];
async function findCityPoint(db, name, env) {
  const key = normalizeSearch(name);
  if (key.length < 2) return { error: "اكتب اسم مدينة من حرفين على الأقل." };
  const landmarkPoint = GCC_TRAVEL_LANDMARKS.find(row => String(row[0]).split("|").some(alias => normalizeSearch(alias) === key));
  if (landmarkPoint) return { name: landmarkPoint[1], lat: landmarkPoint[2], lon: landmarkPoint[3], approximate: true };
  const countryPoint = GCC_COUNTRY_CENTERS.find(row => String(row[0]).split("|").some(alias => normalizeSearch(alias) === key));
  if (countryPoint) return { name: countryPoint[1], lat: countryPoint[2], lon: countryPoint[3], approximate: true };
  const found = GCC_CITIES.find(row => String(row[0]).split("|").some(alias => normalizeSearch(alias) === key));
  if (found) return { name: String(found[0]).split("|")[0], lat: Number(found[1]), lon: Number(found[2]), approximate: true };
  const countries = ["sa", "ae", "qa", "kw", "bh", "om"];
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", String(name).trim()); url.searchParams.set("format", "jsonv2"); url.searchParams.set("addressdetails", "1"); url.searchParams.set("limit", "5"); url.searchParams.set("countrycodes", countries.join(","));
  try {
    const cache = caches.default; const cacheKey = new Request(url.toString()); let response = await cache.match(cacheKey);
    if (!response) {
      if (!env?.GEO_LIMITER) return { error: "خدمة البحث الموسع غير مفعلة حاليا. أرسل موقعك بدلا من اسم المدينة." };
      const geoId = env.GEO_LIMITER.idFromName("gcc-nominatim-global"); const geoStub = env.GEO_LIMITER.get(geoId); const permit = await geoStub.acquire();
      if (!permit.allowed) return { error: "⏳ يوجد ضغط مؤقت على البحث عن المدن. حاول بعد ثوان أو أرسل الموقع." };
      response = await fetch(url.toString(), { headers: { "Accept": "application/json", "Accept-Language": "ar,en;q=0.8", "User-Agent": "GCC-EV-Chargers-Bot/1.0 (https://t.me/GCC_EV_Chargers_bot)" }, signal: AbortSignal.timeout(8000) });
      if (response.ok) { const copy = new Response(response.clone().body, response); copy.headers.set("Cache-Control", "public, max-age=2592000"); await cache.put(cacheKey, copy); }
    }
    if (!response.ok) return { error: "تعذر البحث عن المدينة حاليا. حاول مرة أخرى أو أرسل الموقع." };
    const results = await response.json(); const allowed = new Set(countries);
    const match = results.find(item => {
      const lat = Number(item.lat), lon = Number(item.lon); const country = String(item.address?.country_code || "").toLowerCase(); const placeType = String(item.addresstype || item.type || "").toLowerCase(); const category = String(item.category || item.class || "").toLowerCase();
      const isSettlement = ["city", "town", "village", "hamlet", "municipality", "suburb", "neighbourhood", "locality", "county", "state", "region", "province", "district"].includes(placeType);
      const isAirport = placeType === "aerodrome" || placeType === "airport" || (category === "aeroway" && placeType === "aerodrome");
      const isBorder = ["border_control", "border_crossing", "checkpoint", "crossing"].includes(placeType) || (category === "barrier" && placeType === "border_control");
      const requested = normalizeSearch(name); const named = normalizeSearch([item.name, item.display_name?.split(",")[0]].filter(Boolean).join(" "));
      const significant = requested.split(" ").filter(word => word.length >= 3 && !["border", "crossing", "airport", "international", "منفذ", "مطار", "الحدودي"].includes(word));
      const relatedName = significant.length > 0 && significant.every(word => named.includes(word));
      return allowed.has(country) && isGccPoint(lat, lon) && (isSettlement || ((isAirport || isBorder) && relatedName));
    });
    if (!match) return { error: "لم أجد موقعًا مطابقًا داخل دول الخليج. جرّب اسمًا آخر أو أرسل الموقع مباشرة." };
    return { name: String(match.name || match.display_name.split(",")[0]).trim(), lat: Number(match.lat), lon: Number(match.lon), approximate: true };
  } catch (error) { console.error("CITY_SEARCH_ERROR:", error?.stack || String(error)); return { error: "خدمة البحث عن المدن غير متاحة حاليا. حاول لاحقا أو أرسل الموقع." }; }
}
__name(findCityPoint, "findCityPoint");
async function acceptTripPoint(env, chat, trip, point) {
  const starting = trip.step.startsWith("start_");
  if (starting) {
    await setTrip(env.DB, chat, { start_lat: point.lat, start_lon: point.lon, start_name: point.name, step: "end_choose" });
    await reply(env, chat, `✅ الانطلاق: ${point.name}\n\n` + (point.approximate ? "ℹ️ موقع المدينة تقديري اعتمادًا على مركز المدينة.\n\n" : "") + pointPrompt(false), TRIP_POINT_MENU);
  } else {
    await setTrip(env.DB, chat, { end_lat: point.lat, end_lon: point.lon, end_name: point.name, step: "battery_percent" });
await reply(env, chat, `✅ الوجهة: ${point.name}\n\n🔋 كم نسبة البطارية الحالية؟ اكتب رقمًا من 1 إلى 100 (مثال: 80).`);
  }
}
__name(acceptTripPoint, "acceptTripPoint");
var ROUTES_PER_USER_24H = 1; var ROUTES_PER_UTC_DAY = 1800; var ROUTES_PER_UTC_MINUTE = 35;
async function ensureRouteQuotaTables(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS route_fair_use_users (chat_id TEXT PRIMARY KEY, window_start INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS route_fair_use_buckets (bucket TEXT PRIMARY KEY, used INTEGER NOT NULL DEFAULT 0)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS route_paid_reservations (reservation_id TEXT PRIMARY KEY, chat_id TEXT NOT NULL, window_start INTEGER NOT NULL, minute_bucket TEXT NOT NULL, day_bucket TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'RESERVED', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
}
__name(ensureRouteQuotaTables, "ensureRouteQuotaTables");
async function reserveRouteQuota(db, chat) {
  await ensureRouteQuotaTables(db);
  const now = Math.floor(Date.now() / 1000); const chatId = String(chat); const day = new Date(now * 1000).toISOString().slice(0, 10); const minute = Math.floor(now / 60); const minuteKey = `minute:${minute}`; const dayKey = `day:${day}`;
  await rewardActivateQueued({ DB: db }, chatId);
  const membership = await db.prepare("SELECT plan, expires_at FROM subscriptions WHERE telegram_user_id=?").bind(chatId).first();
  const isOwnerVipPlus = chatId === ADMIN_USER_ID && membership?.plan === "VIP_PLUS";
  const validPaid = membership && PLANS[membership.plan] && Date.parse(membership.expires_at || "") > Date.now();
  if (!validPaid && !isOwnerVipPlus) {
    const reservationId = new Date().toISOString();
    const trial = await db.prepare(`INSERT INTO route_free_trials (telegram_user_id, status, created_at) VALUES (?, 'RESERVED', ?) ON CONFLICT(telegram_user_id) DO UPDATE SET status='RESERVED', created_at=excluded.created_at, used_at=NULL WHERE route_free_trials.status='RESERVED' AND datetime(route_free_trials.created_at) < datetime('now', '-15 minutes') RETURNING telegram_user_id`).bind(chatId, reservationId).first();
    if (!trial) {
      const current = await db.prepare("SELECT status FROM route_free_trials WHERE telegram_user_id=?").bind(chatId).first();
      if (current?.status === "RESERVED") return { ok: false, message: "⏳ توجد محاولة تخطيط قيد التنفيذ. انتظر قليلًا ثم أعد المحاولة. إذا توقفت المحاولة، تُتاح إعادة المحاولة تلقائيًا بعد 15 دقيقة." };
      return { ok: false, message: "🔒 استخدمت تجربتك المجانية لتخطيط الرحلة سابقًا. التجربة متاحة مرة واحدة فقط لكل حساب، ويمكنك الاشتراك لتخطيط رحلات إضافية.\n\n⚡ البحث عن محطات الشحن متاح مجانًا." };
    }
    const release = async () => { await db.prepare("DELETE FROM route_free_trials WHERE telegram_user_id=? AND status='RESERVED' AND created_at=?").bind(chatId, reservationId).run(); };
    const reserveBucket = (key, limit) => db.prepare(`INSERT INTO route_fair_use_buckets (bucket, used) VALUES (?, 1) ON CONFLICT(bucket) DO UPDATE SET used=used+1 WHERE used < ? RETURNING used`).bind(key, limit).first();
    let minuteReserved = false; let dayReserved = false;
    try {
      minuteReserved = Boolean(await reserveBucket(minuteKey, ROUTES_PER_UTC_MINUTE));
      if (!minuteReserved) { await release(); return { ok: false, message: "⏳ يوجد ضغط مؤقت على تخطيط الرحلات. حاول بعد دقيقة؛ لم تُخصم تجربتك." }; }
      dayReserved = Boolean(await reserveBucket(dayKey, ROUTES_PER_UTC_DAY));
      if (!dayReserved) { await db.prepare("UPDATE route_fair_use_buckets SET used=MAX(0,used-1) WHERE bucket=?").bind(minuteKey).run(); await release(); return { ok: false, message: "⏳ اكتمل الحد اليومي لخدمة المسارات. حاول غدًا؛ لم تُخصم تجربتك." }; }
      return { ok: true, freeTrial: true, trialUserId: chatId, reservationId };
    } catch (error) {
      if (dayReserved) await db.prepare("UPDATE route_fair_use_buckets SET used=MAX(0,used-1) WHERE bucket=?").bind(dayKey).run();
      if (minuteReserved) await db.prepare("UPDATE route_fair_use_buckets SET used=MAX(0,used-1) WHERE bucket=?").bind(minuteKey).run();
      await release(); throw error;
    }
  }
  const userLimit = validPaid ? PLANS[membership.plan].routes : ROUTES_PER_USER_24H;
  const user = await db.prepare(`INSERT INTO route_fair_use_users (chat_id, window_start, used) VALUES (?, ?, 1) ON CONFLICT(chat_id) DO UPDATE SET window_start = CASE WHEN window_start <= ? THEN excluded.window_start ELSE window_start END, used = CASE WHEN window_start <= ? THEN 1 ELSE used + 1 END WHERE window_start <= ? OR used < ? OR ? = 1 RETURNING window_start, used`).bind(chatId, now, now - 86400, now - 86400, now - 86400, userLimit, isOwnerVipPlus ? 1 : 0).first();
  if (!user) {
    const old = await db.prepare("SELECT window_start FROM route_fair_use_users WHERE chat_id = ?").bind(chatId).first();
    const hours = Math.max(1, Math.ceil((Number(old?.window_start || now) + 86400 - now) / 3600));
    return { ok: false, message: `⚠️ وصلت إلى حد تخطيط الرحلات لعضويتك (${userLimit} رحلة خلال 24 ساعة).\n\n🔄 يمكنك التخطيط مجددًا بعد حوالي ${hours} ساعة.\n\n⚡ البحث عن المحطات وعرض المزيد متاحان دون حد.` };
  }
  const reserveBucket = (key, limit) => db.prepare(`INSERT INTO route_fair_use_buckets (bucket, used) VALUES (?, 1) ON CONFLICT(bucket) DO UPDATE SET used = used + 1 WHERE used < ? RETURNING used`).bind(key, limit).first();
  const undo = async (key) => { await db.prepare("UPDATE route_fair_use_buckets SET used = MAX(0, used - 1) WHERE bucket = ?").bind(key).run(); };
  const undoUser = async () => { await db.prepare("UPDATE route_fair_use_users SET used = MAX(0, used - 1) WHERE chat_id = ? AND window_start = ?").bind(chatId, Number(user.window_start)).run(); };
  let minuteReserved = false; let dayReserved = false;
  try {
    minuteReserved = Boolean(await reserveBucket(minuteKey, ROUTES_PER_UTC_MINUTE));
    if (!minuteReserved) { await undoUser(); return { ok: false, message: "⏳ يوجد ضغط مؤقت على خدمة تخطيط الرحلات. حاول مجددًا بعد دقيقة؛ لم تُخصم رحلة من حصتك." }; }
    dayReserved = Boolean(await reserveBucket(dayKey, ROUTES_PER_UTC_DAY));
    if (!dayReserved) { await undo(minuteKey); await undoUser(); return { ok: false, message: "⚠️ اكتمل الحد اليومي لخدمة تخطيط الرحلات. حاول غدًا؛ لم تُخصم رحلة من حصتك." }; }
    const reservationId = crypto.randomUUID();
    await db.prepare(`INSERT INTO route_paid_reservations (reservation_id, chat_id, window_start, minute_bucket, day_bucket, status) VALUES (?, ?, ?, ?, ?, 'RESERVED')`).bind(reservationId, chatId, Number(user.window_start), minuteKey, dayKey).run();
    return { ok: true, paidReservationId: reservationId };
  } catch (error) {
    console.error("Route quota reservation error", error);
    if (dayReserved) await undo(dayKey); if (minuteReserved) await undo(minuteKey); await undoUser(); throw error;
  }
}
__name(reserveRouteQuota, "reserveRouteQuota");
async function finishPaidRouteReservation(db, quota, outcome) {
  if (!quota?.paidReservationId) return false;
  const status = outcome === "USED" ? "USED" : "RELEASED";
  const reservation = await db.prepare(`UPDATE route_paid_reservations SET status = ? WHERE reservation_id = ? AND status = 'RESERVED' RETURNING chat_id, window_start, minute_bucket, day_bucket`).bind(status, quota.paidReservationId).first();
  if (!reservation) return false;
  if (status === "RELEASED") {
    await db.batch([db.prepare("UPDATE route_fair_use_users SET used = MAX(0, used - 1) WHERE chat_id = ? AND window_start = ?").bind(reservation.chat_id, reservation.window_start), db.prepare("UPDATE route_fair_use_buckets SET used = MAX(0, used - 1) WHERE bucket = ?").bind(reservation.minute_bucket), db.prepare("UPDATE route_fair_use_buckets SET used = MAX(0, used - 1) WHERE bucket = ?").bind(reservation.day_bucket)]);
  }
  return true;
}
__name(finishPaidRouteReservation, "finishPaidRouteReservation");
async function calculateDrivingRoute(env, trip) {
  const apiKey = String(env.ORS_API_KEY || "").trim(); if (!apiKey) throw new Error("ORS_API_KEY_NOT_CONFIGURED");
  const startLon = Number(trip.start_lon), startLat = Number(trip.start_lat), endLon = Number(trip.end_lon), endLat = Number(trip.end_lat);
  if (!Number.isFinite(startLon) || !Number.isFinite(startLat) || !Number.isFinite(endLon) || !Number.isFinite(endLat)) throw new Error("INVALID_TRIP_COORDINATES");
  const url = "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson"; const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 40000);
  try {
    let response;
    for (const radius of [350, 3000]) {
      response = await fetch(url, { method: "POST", headers: { "Authorization": apiKey, "Content-Type": "application/json", "Accept": "application/geo+json" }, body: JSON.stringify({ coordinates: [[startLon, startLat], [endLon, endLat]], radiuses: [radius, radius], instructions: false }), signal: controller.signal });
      console.log("ORS_RESPONSE_STATUS:", response.status, "RADIUS:", radius);
      if (response.ok) break;
      const errorText = await response.text(); console.error("ORS_ROUTING_ERROR:", response.status, errorText.slice(0, 500));
      if (response.status !== 404 || radius === 3000) throw new Error("ORS_HTTP_" + response.status);
    }
    const data = await response.json(); const route = data.features?.[0];
    if (!route || !Array.isArray(route.geometry?.coordinates) || route.geometry.coordinates.length < 2) throw new Error("NO_DRIVING_ROUTE");
    const summary = route.properties?.summary;
    if (!summary || !Number.isFinite(Number(summary.distance)) || !Number.isFinite(Number(summary.duration))) throw new Error("INVALID_ROUTE_SUMMARY");
    return { km: Number(summary.distance) / 1000, minutes: Number(summary.duration) / 60, points: route.geometry.coordinates.map(pair => [Number(pair[1]), Number(pair[0])]) };
  } finally { clearTimeout(timeout); }
}
__name(calculateDrivingRoute, "calculateDrivingRoute");
function distanceFromRoute(points, lat, lon) {
  let best = Infinity, position = 0, passed = 0; const radians = Math.PI / 180;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], cosine = Math.cos((a[0] + b[0]) / 2 * radians);
    const x1 = a[1] * cosine * 111.195, y1 = a[0] * 111.195, x2 = b[1] * cosine * 111.195, y2 = b[0] * 111.195, x = lon * cosine * 111.195, y = lat * 111.195;
    const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
    const gap = Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)), segmentKm = distanceKm(a[0], a[1], b[0], b[1]);
    if (gap < best) { best = gap; position = passed + segmentKm * t; }
    passed += segmentKm;
  }
  return { km: best, position };
}
__name(distanceFromRoute, "distanceFromRoute");
async function ensureTripResultsTable(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS trip_planner_results (chat_id TEXT PRIMARY KEY, station_ids TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run();
}
__name(ensureTripResultsTable, "ensureTripResultsTable");
async function clearTripResults(db, chat) {
  await ensureTripResultsTable(db);
  await db.prepare("DELETE FROM trip_planner_results WHERE chat_id = ?").bind(String(chat)).run();
}
__name(clearTripResults, "clearTripResults");
async function showTripPage(env, chat, offset = 0) {
  await ensureTripResultsTable(env.DB);
  const result = await env.DB.prepare("SELECT station_ids FROM trip_planner_results WHERE chat_id = ?").bind(String(chat)).first();
  if (!result) { await reply(env, chat, "انتهت نتائج الرحلة. ابدأ تخطيط رحلة جديدة."); return; }
  const data = JSON.parse(result.station_ids);
  const items = tripDisplayItems(data);
  const group = items.slice(offset, offset + 3);
  if (!group.length) return;
  const rows = await env.DB.prepare("SELECT * FROM stations").all();
  const byId = new Map((rows.results || []).map(station => [String(station.id), station]));
  const stations = group.map(item => { const station = byId.get(String(item.id)); return station ? { ...station, routeGap: item.gap, routeKm: item.km, estimatedBattery: item.estimatedBattery } : null; }).filter(Boolean);
  if (!stations.length) { await reply(env, chat, "تعذر عرض هذه المحطات؛ ربما تغيرت بياناتها."); return; }
  const batteryView = !Array.isArray(data) && data.view === "BATTERY";
  const details = stations.map((station, index) => {
    const extra = batteryView && Number.isFinite(Number(station.routeKm)) ? `\n🛣️ المسافة من الانطلاق على المسار: ${Number(station.routeKm).toFixed(0)} كم تقريبًا\n🔋 البطارية المقدرة عند موضع المحطة: ${Number(station.estimatedBattery).toFixed(1)}%` : "";
    return stationText(station, offset + index) + `\n↔️ القرب التقريبي من المسار: ${station.routeGap.toFixed(1)} كم` + extra;
  }).join("\n\n────────────────────\n\n");
  const markup = directionsKeyboard(stations, offset, false);
  if (offset + 3 < items.length) markup.inline_keyboard.push([{ text: "⚡ عرض 3 محطات أخرى", callback_data: `trip_more:${offset + 3}` }]);
  await reply(env, chat, `⚡ محطات الرحلة\n\n${details}\n\n${batteryView ? "⚠️ تنبيه: المسافة ونسبة البطارية تقديريتان ولا تشملان الالتفاف الفعلي للوصول إلى الشاحن. تأكد من توفر احتياطي كافٍ." : ""}\n\nتحقق من حالة الشاحن قبل الذهاب.`, markup);
}
__name(showTripPage, "showTripPage");
async function showTripResults(env, chat, trip) {
  await reply(env, chat, "⏳ جاري حساب طريق القيادة ومحطات الشحن...");
  if (!String(env.ORS_API_KEY || "").trim()) { await setTrip(env.DB, chat, { step: "mode_choose" }); await reply(env, chat, "⚠️ خدمة تخطيط الطرق غير مهيأة. أضف ORS_API_KEY ضمن Secrets في Cloudflare.", TRIP_MODE_MENU); return false; }
  let quota;
  try { quota = await reserveRouteQuota(env.DB, chat); } catch (error) { console.error("Fair-use quota error", error); await setTrip(env.DB, chat, { step: "mode_choose" }); await reply(env, chat, "⚠️ تعذر التحقق من رصيد تخطيط الرحلات مؤقتًا. حاول مجددًا لاحقًا.", TRIP_MODE_MENU); return false; }
  if (!quota.ok) { await setTrip(env.DB, chat, { step: "mode_choose" }); await reply(env, chat, quota.message, TRIP_MODE_MENU); return false; }
  let route;
  try { route = await calculateDrivingRoute(env, trip); } catch (error) {
    console.error("Routing failed", error);
    if (quota?.paidReservationId) { try { await finishPaidRouteReservation(env.DB, quota, "RELEASED"); } catch (refundError) { console.error("PAID_ROUTE_REFUND_FAILED", refundError); } }
    if (quota?.freeTrial) { await env.DB.prepare("DELETE FROM route_free_trials WHERE telegram_user_id=? AND status='RESERVED' AND created_at=?").bind(quota.trialUserId, quota.reservationId).run(); }
    const missing = String(error).includes("ORS_API_KEY_NOT_CONFIGURED");
    await setTrip(env.DB, chat, { step: "mode_choose" });
    await reply(env, chat, missing ? "⚠️ خدمة تخطيط الطرق غير مهيأة. أضف ORS_API_KEY ضمن Secrets في إعدادات Cloudflare ثم اختر نوع الشحن لإعادة المحاولة." : "⚠️ تعذر حساب مسار القيادة. اختر نوع الشحن لإعادة المحاولة أو اضغط رجوع.", TRIP_MODE_MENU);
    return false;
  }
  try {
    const rows = await env.DB.prepare("SELECT * FROM stations").all();
    const stations = (rows.results || []).filter(isEligible).filter(station => matchesMode(station, trip.mode || "ALL")).map(station => {
      const near = distanceFromRoute(route.points, Number(station.latitude), Number(station.longitude));
      return { ...station, routeGap: near.km, routePosition: near.position };
    }).filter(station => station.routeGap <= 15).sort((a, b) => a.routePosition - b.routePosition || a.routeGap - b.routeGap);
    const heading = `🗺️ ${trip.start_name} ← ${trip.end_name}\n🚗 مسافة القيادة: ${route.km.toFixed(0)} كم\n⏱️ المدة التقريبية: ${Math.round(route.minutes)} دقيقة\n⚡ نوع الشحن: ${trip.mode}\n🔌 محطات على مقربة من المسار: ${stations.length}`;
    if (quota?.freeTrial) {
      const claimed = await env.DB.prepare("UPDATE route_free_trials SET status='USED', used_at=CURRENT_TIMESTAMP WHERE telegram_user_id=? AND status='RESERVED' AND created_at=?").bind(quota.trialUserId, quota.reservationId).run();
      if (Number(claimed.meta?.changes || 0) !== 1) { await setTrip(env.DB, chat, { step: "mode_choose" }); await reply(env, chat, "⏳ انتهت صلاحية محاولة التخطيط السابقة. أعد المحاولة من جديد.", TRIP_MODE_MENU); return false; }
    }
    if (quota?.paidReservationId) {
      const committed = await finishPaidRouteReservation(env.DB, quota, "USED");
      if (!committed) { await setTrip(env.DB, chat, { step: "mode_choose" }); await reply(env, chat, "⏳ انتهت صلاحية محاولة التخطيط السابقة. أعد المحاولة.", TRIP_MODE_MENU); return false; }
    }
    await reply(env, chat, heading + "\n\nℹ️ المحطات ضمن 15 كم هندسيًا من المسار، وليست مسافة الالتفاف بالسيارة. قد تتطلب الرحلات العابرة للحدود خدمة مسارات تدعم المعابر. تحقق من إمكانية الوصول وحالة الشاحن.");
    await ensureTripResultsTable(env.DB);
    const battery = tripBatterySummary(trip, route.km);
    const serialized = JSON.stringify({ view: "ALL", battery, items: stations.map(s => ({ id: s.id, gap: s.routeGap, km: route.km > 0 ? s.routePosition / Math.max(0.001, route.points.reduce((sum, p, i) => i ? sum + distanceKm(route.points[i - 1][0], route.points[i - 1][1], p[0], p[1]) : sum, 0)) * route.km : 0 })) });
    await env.DB.prepare(`INSERT INTO trip_planner_results (chat_id, station_ids, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(chat_id) DO UPDATE SET station_ids = excluded.station_ids, updated_at = CURRENT_TIMESTAMP`).bind(String(chat), serialized).run();
    if (battery) {
      const status = battery.finish >= 25 ? "✅ يمكن الوصول نظريًا دون شحن مع احتياطي 25%." : "⚠️ يُنصح بالشحن أثناء الرحلة (احتياطي أقل من 25%).";
      
      let advice = "";
      if (battery.finish < 25) {
        // البحث عن المحطة الأقرب لمنتصف المسافة
        let nearest = null;
        let minDiff = Infinity;
        const midPoint = route.km / 2;
        for (const s of stations) {
          if (s.routePosition > 0) {
            const diff = Math.abs(s.routePosition - midPoint);
            if (diff < minDiff) {
              minDiff = diff;
              nearest = s;
            }
          }
        }
        if (!nearest && stations.length > 0) {
          nearest = stations[0];
        }
        if (nearest) {
          advice = `\n\n💡 ننصح بالتوقف في محطة **${nearest.name}** (التي تبعد ${nearest.routePosition ? nearest.routePosition.toFixed(0) : '0'} كم من انطلاقك) لشحن سيارتك.`;
        }
      }
      
      await reply(env, chat, `🔋 البطارية عند الانطلاق: ${battery.pct}%\n🏁 المتوقع عند الوصول: ${battery.finish.toFixed(1)}%\n🎯 مستوى البحث: ${battery.target.toFixed(1)}% بعد ${battery.targetKm.toFixed(0)} كم تقريبًا\n${status}${advice}\n\nاختر طريقة عرض المحطات:`, TRIP_DISPLAY_MENU);
    } else {
      await reply(env, chat, "اختر طريقة عرض المحطات:", TRIP_DISPLAY_MENU);
    }
    try { await batterySaveRoute(env, chat, route.km); } catch (error) { console.error("BATTERY_ROUTE_SAVE_FAILED", error); }
    return true;
  } catch (error) {
    if (quota?.paidReservationId) { try { await finishPaidRouteReservation(env.DB, quota, "RELEASED"); } catch (refundError) { console.error("PAID_ROUTE_REFUND_FAILED", refundError); } }
    if (quota?.freeTrial) { await env.DB.prepare("DELETE FROM route_free_trials WHERE telegram_user_id=? AND status='RESERVED' AND created_at=?").bind(quota.trialUserId, quota.reservationId).run(); }
    throw error;
  }
}
__name(showTripResults, "showTripResults");
async function handleTripMore(env, callback) {
  const chat = callback.message?.chat?.id;
  const match = /^trip_more:(\d+)$/.exec(callback.data || "");
  if (!chat || !match) return;
  const offset = Number(match[1]);
  await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id });
  if (!Number.isSafeInteger(offset) || offset < 3 || offset > 3000 || offset % 3 !== 0) return;
  await showTripPage(env, chat, offset);
}
__name(handleTripMore, "handleTripMore");
async function handleTripText(env, chat, text, trip) {
  if (text === "🔙 رجوع") {
    if (trip.step === "mode_choose") { await setTrip(env.DB, chat, { step: "end_choose" }); await reply(env, chat, pointPrompt(false), TRIP_POINT_MENU); }
    else if (trip.step === "end_text") { await setTrip(env.DB, chat, { step: "end_choose" }); await reply(env, chat, pointPrompt(false), TRIP_POINT_MENU); }
    else if (trip.step === "end_choose") { await setTrip(env.DB, chat, { step: "start_choose" }); await reply(env, chat, pointPrompt(true), TRIP_POINT_MENU); }
    else if (trip.step === "start_text") { await setTrip(env.DB, chat, { step: "start_choose" }); await reply(env, chat, pointPrompt(true), TRIP_POINT_MENU); }
    else { await clearTrip(env.DB, chat); await reply(env, chat, "🏠 عدت إلى القائمة الرئيسية.", MAIN_MENU); }
    return;
  }
  if (text === "🔍 كتابة اسم المدينة" && trip.step.endsWith("_choose")) {
    await setTrip(env.DB, chat, { step: trip.step.startsWith("start") ? "start_text" : "end_text" });
    await reply(env, chat, "🔎 اكتب اسم المدينة كرسالة نصية في خانة الكتابة، مثل: الرياض. لا تضغط زر كتابة اسم المدينة مرة أخرى.", { remove_keyboard: true });
    return;
  }
  if (text === "📍 إرسال الموقع") { await reply(env, chat, "📍 اضغط زر إرسال الموقع، أو أرسل موقعًا من خريطة Telegram.", TRIP_POINT_MENU); return; }
  if (["start_choose", "start_text", "end_choose", "end_text"].includes(trip.step)) {
    const point = await findCityPoint(env.DB, text, env);
    if (point.error) { await reply(env, chat, `⚠️ ${point.error}`, TRIP_POINT_MENU); return; }
    await acceptTripPoint(env, chat, trip, point); return;
  }
  if (trip.step === "mode_choose") {
    const options = { "⚡ شحن سريع DC فقط": "DC", "🔌 شحن عادي AC فقط": "AC", "🔋 جميع محطات الشحن": "ALL" };
    if (!options[text]) { 
      await reply(env, chat, "اختر نوع الشحن من القائمة.", TRIP_MODE_MENU); 
      return; 
    }
    await setTrip(env.DB, chat, { mode: options[text] });
    // بما أننا قمنا بالفعل بإدخال البطارية والسعة والاستهلاك، نعرض النتائج مباشرة
    const current = await getTrip(env.DB, chat);
    const completed = await showTripResults(env, chat, current);
    if (completed) await clearTrip(env.DB, chat); 
    return;
  }
    if (["battery_percent", "battery_capacity", "battery_consumption"].includes(trip.step)) {
    const value = Number(text.replace(",", "."));
    const rules = { 
      battery_percent: [1, 100, "battery_capacity", "🔋 ما سعة البطارية بالكيلوواط ساعة kWh؟ مثال: 100"], 
      battery_capacity: [5, 250, "battery_consumption", "⚡ ما متوسط استهلاك السيارة kWh/100km؟ مثال: 22"], 
      battery_consumption: [5, 80, "mode_choose", ""] // الخطوة التالية هي اختيار نوع الشاحن
    };
    const [min, max, next, prompt] = rules[trip.step];
    if (!Number.isFinite(value) || value < min || value > max) { 
      await reply(env, chat, `⚠️ أدخل رقمًا بين ${min} و${max}.`); 
      return; 
    }
    await setTrip(env.DB, chat, { [trip.step]: value, step: next });
    
    if (next === "mode_choose") {
      await reply(env, chat, "⚡ اختر نوع محطات الشحن على مسار الرحلة:", TRIP_MODE_MENU);
      return;
    }
    
    if (prompt) { 
      await reply(env, chat, prompt); 
      return; 
    }
  } {
    const value = Number(text.replace(",", "."));
    const rules = { battery_percent: [1, 100, "battery_capacity", "🔋 ما سعة البطارية بالكيلوواط ساعة kWh؟ مثال: 100"], battery_capacity: [5, 250, "battery_consumption", "⚡ ما متوسط استهلاك السيارة kWh/100km؟ مثال: 22"], battery_consumption: [5, 80, "calculating", ""] };
    const [min, max, next, prompt] = rules[trip.step];
    if (!Number.isFinite(value) || value < min || value > max) { await reply(env, chat, `⚠️ أدخل رقمًا بين ${min} و${max}.`); return; }
    await setTrip(env.DB, chat, { [trip.step]: value, step: next });
    if (prompt) { await reply(env, chat, prompt); return; }
    const current = await getTrip(env.DB, chat);
    const completed = await showTripResults(env, chat, current);
    if (completed) await clearTrip(env.DB, chat); return;
  }
  await reply(env, chat, pointPrompt(trip.step.startsWith("start")), TRIP_POINT_MENU);
}
__name(handleTripText, "handleTripText");
const REWARD_COSTS = { SILVER: 15, GOLD: 35, VIP: 80 };
const REWARD_LABEL = "🎁 نقاطي ودعواتي";
async function rewardSchema(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS reward_legacy_users (user_id TEXT PRIMARY KEY)`,
    `CREATE TABLE IF NOT EXISTS reward_notices (credit_id INTEGER PRIMARY KEY, sent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS reward_users (user_id TEXT PRIMARY KEY, inviter_id TEXT, first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, qualified_at TEXT)`,
    `CREATE TABLE IF NOT EXISTS reward_credits (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, source_key TEXT NOT NULL UNIQUE, original_points INTEGER NOT NULL CHECK(original_points>0), remaining INTEGER NOT NULL CHECK(remaining>=0), earned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, expires_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'AVAILABLE', note TEXT)`,
    `CREATE INDEX IF NOT EXISTS idx_reward_credits_user ON reward_credits(user_id,status,expires_at,id)`,
    `CREATE TABLE IF NOT EXISTS reward_redemptions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, plan TEXT NOT NULL, cost INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, starts_at TEXT, ends_at TEXT, activated_at TEXT, source TEXT NOT NULL DEFAULT 'POINTS')`,
    `CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user ON reward_redemptions(user_id,created_at)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_reward_one_queued ON reward_redemptions(user_id) WHERE status='QUEUED'`,
    `CREATE TABLE IF NOT EXISTS reward_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, actor_id TEXT NOT NULL, user_id TEXT NOT NULL, action TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS reward_flags (user_id TEXT PRIMARY KEY, reason TEXT, status TEXT NOT NULL DEFAULT 'HELD', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_reward_one_pending ON reward_redemptions(user_id) WHERE status='PENDING'`,
    `CREATE TRIGGER IF NOT EXISTS reward_redeem_guard BEFORE INSERT ON reward_redemptions WHEN NEW.source='POINTS' BEGIN
      SELECT RAISE(ABORT,'reward protected VIP_PLUS') WHERE EXISTS(SELECT 1 FROM subscriptions WHERE telegram_user_id=NEW.user_id AND plan='VIP_PLUS');
      SELECT RAISE(ABORT,'reward active subscription changed') WHERE NEW.status='ACTIVE' AND EXISTS(SELECT 1 FROM subscriptions WHERE telegram_user_id=NEW.user_id AND datetime(expires_at)>datetime('now'));
      SELECT RAISE(ABORT,'reward insufficient points') WHERE (SELECT COALESCE(SUM(remaining),0) FROM reward_credits WHERE user_id=NEW.user_id AND status='AVAILABLE' AND expires_at>CURRENT_TIMESTAMP)<NEW.cost;
      SELECT RAISE(ABORT,'reward redemption cadence') WHERE EXISTS(SELECT 1 FROM reward_redemptions WHERE user_id=NEW.user_id AND source='POINTS' AND created_at>datetime('now','-30 days'));
      SELECT RAISE(ABORT,'reward already queued') WHERE EXISTS(SELECT 1 FROM reward_redemptions WHERE user_id=NEW.user_id AND status IN('PENDING','QUEUED'));
    END`,
    `CREATE TRIGGER IF NOT EXISTS reward_redeem_debit AFTER INSERT ON reward_redemptions WHEN NEW.source='POINTS' BEGIN
      UPDATE reward_credits SET remaining=remaining-(WITH ranked AS MATERIALIZED (
        SELECT id,COALESCE(SUM(remaining) OVER (ORDER BY expires_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),0) AS prior
        FROM reward_credits WHERE user_id=NEW.user_id AND status='AVAILABLE' AND expires_at>CURRENT_TIMESTAMP AND remaining>0
      ) SELECT MIN(reward_credits.remaining,MAX(0,NEW.cost-prior)) FROM ranked WHERE ranked.id=reward_credits.id)
      WHERE id IN (SELECT id FROM reward_credits WHERE user_id=NEW.user_id AND status='AVAILABLE' AND expires_at>CURRENT_TIMESTAMP AND remaining>0);
    END`
  ];
  for (const sql of statements) await db.prepare(sql).run();
}
function rewardTime(days=0) { return new Date(Date.now()+days*86400000).toISOString(); }
async function rewardBalance(db,user) {
  const r=await db.prepare("SELECT COALESCE(SUM(remaining),0) AS points FROM reward_credits WHERE user_id=? AND status='AVAILABLE' AND expires_at>CURRENT_TIMESTAMP").bind(String(user)).first();
  return Number(r?.points||0);
}
async function rewardRegister(env,message) {
  if(message.chat?.type!=='private'||!message.from?.id)return;
  const user=String(message.from.id), text=(message.text||'').trim();
  await rewardSchema(env.DB);
  const match=/^\/start(?:@GCC_EV_Chargers_bot)?\s+ref_(\d{1,20})$/.exec(text);
  const inviter=match&&match[1]!==user?match[1]:null;
  const baseline=await env.DB.prepare("SELECT 1 AS ok FROM reward_legacy_users WHERE user_id='__BASELINE_READY__'").first();
  if(!baseline){ console.error('REWARD_BASELINE_NOT_INITIALIZED',user); return; }
    const legacy = await env.DB.prepare(`SELECT 1 AS old FROM reward_legacy_users WHERE user_id=? LIMIT 1`).bind(user).first();
  await env.DB.prepare('INSERT OR IGNORE INTO reward_users(user_id,inviter_id) VALUES(?,?)').bind(user, legacy ? null : inviter).run();
}
async function rewardQualify(env,message) {
  if(message.chat?.type!=='private'||!message.from?.id)return;
  const user=String(message.from.id);
  await rewardSchema(env.DB);
  const row=await env.DB.prepare('SELECT inviter_id,qualified_at FROM reward_users WHERE user_id=?').bind(user).first();
  if(!row?.inviter_id||row.qualified_at)return;
  const suspicious=await env.DB.prepare("SELECT COUNT(*) AS n FROM reward_users WHERE inviter_id=? AND first_seen_at>datetime('now','-1 hour')").bind(row.inviter_id).first();
  const held=Number(suspicious?.n||0)>20;
  const source=`ref:${user}`;
  await env.DB.batch([
    env.DB.prepare(`INSERT OR IGNORE INTO reward_credits(user_id,source_key,original_points,remaining,expires_at,status,note) SELECT inviter_id,?,1,1,datetime('now','+12 months'),?,? FROM reward_users WHERE user_id=? AND qualified_at IS NULL AND inviter_id IS NOT NULL`).bind(source,held?'HELD':'AVAILABLE',held?'Rapid referral pattern':'Qualified referral',user),
    env.DB.prepare(`UPDATE reward_users SET qualified_at=CURRENT_TIMESTAMP WHERE user_id=? AND qualified_at IS NULL AND EXISTS(SELECT 1 FROM reward_credits WHERE source_key=?)`).bind(user,source),
    env.DB.prepare(`INSERT INTO reward_audit(actor_id,user_id,action,detail) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM reward_audit WHERE action IN('REFERRAL_HELD','REFERRAL_EARNED') AND detail=?)`).bind(user,row.inviter_id,held?'REFERRAL_HELD':'REFERRAL_EARNED',source,source)
  ]);
  if(held)await env.DB.prepare("INSERT OR IGNORE INTO reward_flags(user_id,reason) VALUES(?,'More than 20 referrals within an hour')").bind(row.inviter_id).run();
}
async function rewardHome(env,user) {
  await rewardSchema(env.DB);
  const uid=String(user), points=await rewardBalance(env.DB,uid);
  const invites=await env.DB.prepare('SELECT COUNT(*) AS n FROM reward_users WHERE inviter_id=? AND qualified_at IS NOT NULL').bind(uid).first();
  const held=await env.DB.prepare("SELECT COALESCE(SUM(remaining),0) AS n FROM reward_credits WHERE user_id=? AND status='HELD' AND expires_at>CURRENT_TIMESTAMP").bind(uid).first();
  const queued=await env.DB.prepare("SELECT plan FROM reward_redemptions WHERE user_id=? AND status='QUEUED' ORDER BY id DESC LIMIT 1").bind(uid).first();
  const inviteLink = `https://t.me/GCC_EV_Chargers_bot?start=ref_${uid}`;
  const shareText = `⚡ مرحباً! أنصحك بتجربة بوت "دليل شواحن السيارات الكهربائية بالخليج" 📍\n\nبوت يسهل عليك إيجاد أقرب محطات الشحن وتخطيط رحلاتك بذكاء.\n\n🎁 استخدم رابط الدعوة الخاص بي للانضمام:\n${inviteLink}`;
  await reply(env,user,
    `🎁 نقاطي ودعواتي\n\n💰 النقاط المتاحة: ${points}\n👥 الدعوات المؤهلة: ${Number(invites?.n||0)}\n⏳ نقاط قيد المراجعة: ${Number(held?.n||0)}\n📌 عضوية محجوزة: ${queued?.plan||'لا يوجد'}\n\n🔗 رابط دعوتك:\n${inviteLink}\n\nكل دعوة جديدة مؤهلة = نقطة واحدة. النقاط تنتهي بعد 12 شهرًا من اكتسابها.`, 
    { 
      inline_keyboard: [
        [{ text: "📋 نسخ رسالة الدعوة", copy_text: { text: shareText } }],
        [{ text: '🥈 الفضية — 15 نقطة',callback_data:'reward_choose:SILVER'},{text:'🥇 الذهبية — 35 نقطة',callback_data:'reward_choose:GOLD'}],
        [{ text: '💎 VIP — 80 نقطة',callback_data:'reward_choose:VIP'},{text:'📋 سجل مكافآتي',callback_data:'reward_history'}]
      ] 
    }
  );
}
async function rewardPreview(env,callback,plan) {
  if(callback.message?.chat?.type!=='private'||String(callback.message.chat.id)!==String(callback.from.id))return;
  const user=String(callback.from.id), cost=REWARD_COSTS[plan];
  if(!cost)return;
  const points=await rewardBalance(env.DB,user);
  await reply(env,user,`🎁 تأكيد استبدال العضوية ${plan}\n\nالمطلوب: ${cost} نقطة\nرصيدك: ${points} نقطة\nالمدة: 30 يومًا\nالرحلات: ${PLANS[plan].routes}\n\n⚠️ الاستبدال نهائي ولا يمكن إلغاؤه. إذا كان اشتراكك نشطًا، تُحجز العضوية حتى انتهائه.`,{inline_keyboard:[[{text:'✅ تأكيد الاستبدال النهائي',callback_data:`reward_confirm:${plan}`}],[{text:'↩️ إلغاء قبل الخصم',callback_data:'reward_home'}]]});
}
async function rewardRedeem(env,callback,plan) {
  if(callback.message?.chat?.type!=='private'||String(callback.message.chat.id)!==String(callback.from.id))return;
  const user=String(callback.from.id),cost=REWARD_COSTS[plan];if(!cost)return;
  await rewardSchema(env.DB);
  const current=await env.DB.prepare('SELECT plan,expires_at FROM subscriptions WHERE telegram_user_id=?').bind(user).first();
  if(current?.plan==='VIP_PLUS'){ await reply(env,user,'⛔ عضوية VIP_PLUS محمية ولا يمكن استبدال النقاط عليها.'); return; }
  const active=!!(current && Date.parse(current.expires_at||'')>Date.now() && (PLANS[current.plan]||current.plan==='VIP_PLUS'));
  const start=active?new Date(current.expires_at).toISOString():rewardTime();
  const end=new Date(Date.parse(start)+30*86400000).toISOString();
  try {
    const tasks=[env.DB.prepare(`INSERT INTO reward_redemptions(user_id,plan,cost,status,starts_at,ends_at,activated_at) VALUES(?,?,?,?,?,?,?)`).bind(user,plan,cost,active?'QUEUED':'ACTIVE',start,end,active?null:start)];
    if(!active)tasks.push(env.DB.prepare(`INSERT INTO subscriptions(telegram_user_id,plan,daily_route_limit,started_at,expires_at,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP) ON CONFLICT(telegram_user_id) DO UPDATE SET plan=excluded.plan,daily_route_limit=excluded.daily_route_limit,started_at=excluded.started_at,expires_at=excluded.expires_at,updated_at=CURRENT_TIMESTAMP WHERE subscriptions.expires_at IS NULL OR datetime(subscriptions.expires_at)<=datetime('now')`).bind(user,plan,PLANS[plan].routes,end));
    tasks.push(env.DB.prepare('INSERT INTO reward_audit(actor_id,user_id,action,detail) VALUES(?,?,?,?)').bind(user,user,'REDEEM',`${plan}: ${cost}`));
    await env.DB.batch(tasks);
    await reply(env,user,active?`✅ تم حجز عضوية ${plan} بعد انتهاء اشتراكك الحالي. خُصم ${cost} نقطة.`:`✅ تم تفعيل عضوية ${plan} لمدة 30 يومًا. خُصم ${cost} نقطة.`);
  }catch(error){console.error('REWARD_REDEEM_REJECTED',String(error));await reply(env,user,'⚠️ لم يتم الاستبدال. تحقق من الرصيد وشرط 30 يومًا والعضوية المحجوزة، ثم حاول مجددًا.');}
}
async function rewardActivateQueued(env,user) {
  await rewardSchema(env.DB);
  const uid=String(user);
  const queued=await env.DB.prepare("SELECT id,plan FROM reward_redemptions WHERE user_id=? AND status='QUEUED' ORDER BY id LIMIT 1").bind(uid).first();
  if(!queued||!PLANS[queued.plan])return;
  const current=await env.DB.prepare('SELECT plan,expires_at FROM subscriptions WHERE telegram_user_id=?').bind(uid).first();
  if(current?.plan==='VIP_PLUS')return;
  if(current&&Date.parse(current.expires_at||'')>Date.now())return;
  const end=rewardTime(30);
  await env.DB.batch([
    env.DB.prepare(`INSERT INTO subscriptions(telegram_user_id,plan,daily_route_limit,started_at,expires_at,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP) ON CONFLICT(telegram_user_id) DO UPDATE SET plan=excluded.plan,daily_route_limit=excluded.daily_route_limit,started_at=excluded.started_at,expires_at=excluded.expires_at,updated_at=CURRENT_TIMESTAMP WHERE subscriptions.plan!='VIP_PLUS' AND (subscriptions.expires_at IS NULL OR datetime(subscriptions.expires_at)<=datetime('now'))`).bind(uid,queued.plan,PLANS[queued.plan].routes,end),
    env.DB.prepare(`UPDATE reward_redemptions SET status='ACTIVE',starts_at=CURRENT_TIMESTAMP,ends_at=?,activated_at=CURRENT_TIMESTAMP WHERE id=? AND status='QUEUED' AND EXISTS(SELECT 1 FROM subscriptions WHERE telegram_user_id=? AND plan=? AND expires_at=?)`).bind(end,queued.id,uid,queued.plan,end)
  ]);
}
async function rewardHistory(env,user) {
  const rows=await env.DB.prepare('SELECT plan,cost,status,created_at FROM reward_redemptions WHERE user_id=? ORDER BY id DESC LIMIT 8').bind(String(user)).all();
  await reply(env,user,'📋 آخر عمليات الاستبدال:\n'+((rows.results||[]).map(r=>`${r.created_at} | ${r.plan} | ${r.cost} نقطة | ${r.status}`).join('\n')||'لا توجد عمليات بعد.'));
}
async function rewardAdmin(env,message) {
  const text=(message.text||'').trim();
  if(!text.startsWith('/reward_admin'))return false;
  if(String(message.from?.id)!==ADMIN_USER_ID || message.chat?.type!=='private'){await reply(env,message.chat.id,'⛔ الأمر للمشرف فقط.');return true;}
  await rewardSchema(env.DB);
  const parts=text.split(/\s+/);
  if(parts.length===1){await reply(env,message.chat.id,'أوامر المشرف:\n/reward_admin points USER_ID COUNT REASON\n/reward_admin deduct USER_ID COUNT REASON\n/reward_admin grant USER_ID SILVER|GOLD|VIP REASON\n/reward_admin approve CREDIT_ID\n/reward_admin reject CREDIT_ID\n/reward_admin status USER_ID');return true;}
  const [,action,target,arg,...reasonParts]=parts,reason=reasonParts.join(' ');
  if(action==='status') {const points=await rewardBalance(env.DB,target);await reply(env,message.chat.id,`رصيد ${target}: ${points} نقطة`);return true;}
  if(action==='points' && /^\d+$/.test(target) && /^\d+$/.test(arg) && Number(arg)>0 && Number(arg)<=100 && reason){
    const key=`admin:${crypto.randomUUID()}`;
    await env.DB.prepare("INSERT INTO reward_credits(user_id,source_key,original_points,remaining,expires_at,note) VALUES(?,?,?,?,datetime('now','+12 months'),?)").bind(target,key,Number(arg),Number(arg),reason).run();
    await env.DB.prepare('INSERT INTO reward_audit(actor_id,user_id,action,detail) VALUES(?,?,?,?)').bind(ADMIN_USER_ID,target,'ADMIN_POINTS',`${arg}: ${reason}`).run();
    await reply(env,message.chat.id,'✅ أضيفت النقاط وسُجل السبب.');return true;
  }
  if(action==='deduct' && /^\d+$/.test(target) && /^\d+$/.test(arg) && Number(arg)>0 && Number(arg)<=100 && reason){
    const amount=Number(arg), balance=await rewardBalance(env.DB,target);
    if(balance<amount){await reply(env,message.chat.id,`⚠️ الرصيد المتاح ${balance} نقطة، لا يمكن خصم ${amount}.`);return true;}
    try {
      await env.DB.batch([
        env.DB.prepare(`UPDATE reward_credits SET remaining=remaining-(WITH ranked AS MATERIALIZED (SELECT id,COALESCE(SUM(remaining) OVER (ORDER BY expires_at,id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),0) AS prior FROM reward_credits WHERE user_id=? AND status='AVAILABLE' AND expires_at>CURRENT_TIMESTAMP AND remaining>0) SELECT MIN(reward_credits.remaining,MAX(0,?-prior)) FROM ranked WHERE ranked.id=reward_credits.id) WHERE user_id=? AND status='AVAILABLE'AND expires_at>CURRENT_TIMESTAMP AND remaining>0`).bind(target,amount,target),
        env.DB.prepare('INSERT INTO reward_audit(actor_id,user_id,action,detail) VALUES(?,?,?,?)').bind(ADMIN_USER_ID,target,'ADMIN_DEDUCT',`${amount}: ${reason}`)
      ]);
      await reply(env,message.chat.id,'✅ خُصمت النقاط وسُجل السبب.');
    }catch(error){console.error('REWARD_ADMIN_DEDUCT_FAILED',String(error));await reply(env,message.chat.id,'⚠️ تعذر الخصم، لم يتم تأكيد العملية.');}
    return true;
  }
  if(action==='grant' && /^\d+$/.test(target) && PLANS[arg] && reason){
    const protectedPlan=await env.DB.prepare('SELECT plan FROM subscriptions WHERE telegram_user_id=?').bind(target).first();
    if(protectedPlan?.plan==='VIP_PLUS'){await reply(env,message.chat.id,'⛔ لا يمكن تعديل عضوية VIP_PLUS من هذا الأمر.');return true;}
    const row=await env.DB.prepare('SELECT expires_at FROM subscriptions WHERE telegram_user_id=?').bind(target).first();
    const start=Math.max(Date.now(),Date.parse(row?.expires_at||'')||0),end=new Date(start+30*86400000).toISOString();
    if (start > Date.now()+1000) {
      const pending=await env.DB.prepare("SELECT id FROM reward_redemptions WHERE user_id=? AND status='QUEUED'").bind(target).first();
      if(pending){await reply(env,message.chat.id,'⚠️ توجد عضوية محجوزة لهذا المستخدم. لم يتم منح عضوية إضافية.');return true;}
      await env.DB.prepare("INSERT INTO reward_redemptions(user_id,plan,cost,status,starts_at,ends_at,source) VALUES(?,?,0,'QUEUED',?,?,'ADMIN')").bind(target,arg,new Date(start).toISOString(),end).run();
    } else {
      await env.DB.prepare('INSERT INTO subscriptions(telegram_user_id,plan,daily_route_limit,started_at,expires_at,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP) ON CONFLICT(telegram_user_id) DO UPDATE SET plan=excluded.plan,daily_route_limit=excluded.daily_route_limit,expires_at=excluded.expires_at,updated_at=CURRENT_TIMESTAMP WHERE subscriptions.plan!="VIP_PLUS" AND (subscriptions.expires_at IS NULL OR datetime(subscriptions.expires_at)<=datetime("now"))').bind(target,arg,PLANS[arg].routes,end).run();
    }
    await env.DB.prepare('INSERT INTO reward_audit(actor_id,user_id,action,detail) VALUES(?,?,?,?)').bind(ADMIN_USER_ID,target,'ADMIN_GRANT',`${arg}: ${reason}`).run();
    await reply(env,message.chat.id,'✅ تم منح العضوية وتسجيل السبب.');return true;
  }
  if((action==='approve'||action==='reject') && /^\d+$/.test(target)){
    const credit=await env.DB.prepare("SELECT user_id FROM reward_credits WHERE id=? AND status='HELD'").bind(Number(target)).first();
    if(!credit){await reply(env,message.chat.id,'لم يتم العثور على نقطة معلقة بهذا الرقم.');return true;}
    await env.DB.prepare('UPDATE reward_credits SET status=? WHERE id=? AND status=\'HELD\'').bind(action==='approve'?'AVAILABLE':'REJECTED',Number(target)).run();
    await env.DB.prepare('INSERT INTO reward_audit(actor_id,user_id,action,detail) VALUES(?,?,?,?)').bind(ADMIN_USER_ID,credit.user_id,`ADMIN_${action.toUpperCase()}`,target).run();
    await reply(env,message.chat.id,'✅ تمت المراجعة.');return true;
  }
  await reply(env,message.chat.id,'⚠️ صيغة الأمر غير صحيحة. أرسل /reward_admin للمساعدة.');return true;
}

var ADMIN_USER_ID = "1049301680";
var PLANS = { SILVER: { name: "🥈 الفضية", price: 9, routes: 10 }, GOLD: { name: "🥇 الذهبية", price: 19, routes: 30 }, VIP: { name: "💎 VIP", price: 39, routes: 100 } };
var MEMBERSHIP_MENU_LABEL = "💎 عضويتي والاشتراكات";
function isPrivate(message) { return message?.chat?.type === "private"; }
__name(isPrivate, "isPrivate");
function subscriptionKeyboard() { return { inline_keyboard: [ [{ text: "🥈 الفضية — 9 ر.س / 30 يوم", callback_data: "sub_plan:SILVER" }], [{ text: "🥇 الذهبية — 19 ر.س / 30 يوم", callback_data: "sub_plan:GOLD" }], [{ text: "💎 VIP — 39 ر.س / 30 يوم", callback_data: "sub_plan:VIP" }], [{ text: "📋 حالة طلباتي", callback_data: "sub_status" }] ] }; }
__name(subscriptionKeyboard, "subscriptionKeyboard");
async function readRouteUsage(db, userId) {
  await ensureRouteQuotaTables(db);
  const trial = await db.prepare("SELECT status FROM route_free_trials WHERE telegram_user_id=?").bind(String(userId)).first();
  const record = await db.prepare("SELECT window_start, used FROM route_fair_use_users WHERE chat_id = ?").bind(String(userId)).first();
  const now = Math.floor(Date.now() / 1000); const started = Number(record?.window_start);
  if (!record || !Number.isFinite(started) || started + 86400 <= now) return { used: 0, resetsAt: null, trialUsed: trial?.status === "USED" };
  return { used: Math.max(0, Number(record.used) || 0), resetsAt: started + 86400, trialUsed: trial?.status === "USED" };
}
__name(readRouteUsage, "readRouteUsage");
async function subscriptionOverview(env, userId) {
  const row = await env.DB.prepare("SELECT plan, expires_at FROM subscriptions WHERE telegram_user_id = ?").bind(String(userId)).first();
  const isOwnerVipPlus = String(userId) === ADMIN_USER_ID && row?.plan === "VIP_PLUS";
  const active = row && PLANS[row.plan] && row.expires_at && Date.parse(row.expires_at) > Date.now();
  const plan = active ? PLANS[row.plan] : null; const limit = plan ? plan.routes : ROUTES_PER_USER_24H;
  const usage = await readRouteUsage(env.DB, userId); const remaining = plan ? Math.max(0, limit - usage.used) : (usage.trialUsed ? 0 : 1);
  const displayTime = (iso) => new Intl.DateTimeFormat("ar-SA", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(iso));
  const renewal = usage.resetsAt ? displayTime(usage.resetsAt * 1000) + " (بتوقيت السعودية)" : "بعد 24 ساعة من أول محاولة جديدة";
  const expiry = plan ? `\n📅 تنتهي العضوية: ${displayTime(row.expires_at)} (بتوقيت السعودية)` : "";
  if (isOwnerVipPlus) {
    const message2 = `👑 عضويتك الحالية: VIP+ ♾️\n\n🗺️ إجمالي المحاولات: ♾️ غير محدود\n✅ المحاولات المستخدمة خلال 24 ساعة: ${usage.used}\n🔋 المحاولات المتبقية: ♾️ غير محدود\n🔄 تجديد المحاولات: غير مطلوب\n📅 انتهاء العضوية: ♾️ مدى الحياة\n\n🛡️ تخضع الرحلات لحدود حماية خدمة المسارات العامة.\n🔒 هذه العضوية خاصة بمالك البوت ولا تُعرض للبيع.`;
    await reply(env, userId, message2, subscriptionKeyboard()); return;
  }
  if (!plan) {
    const message = `💎 عضويتي والاشتراكات\n\nعضويتك الحالية: 🆓 مجانية\n🗺️ التجربة المجانية: ${usage.trialUsed ? "مستخدمة" : "متاحة"}\n🔋 التجارب المتبقية: ${remaining}\n🔒 التجربة متاحة مرة واحدة لكل حساب ولا تتجدد بعد 24 ساعة.\n\n⚡ البحث عن محطات الشحن متاح مجانًا.\nيمكنك الاشتراك للحصول على رحلات إضافية:`;
    await reply(env, userId, message, subscriptionKeyboard()); return;
  }
  const message = `💎 عضويتي والاشتراكات\n\nعضويتك الحالية: ${plan.name}\n\n🗺️ إجمالي المحاولات: ${limit} خلال 24 ساعة\n✅ المحاولات المستخدمة: ${usage.used}\n🔋 المحاولات المتبقية: ${remaining}\n🔄 تجديد المحاولات: ${renewal}${expiry}\n\nℹ️ يُحتسب الاستخدام من سجل طلبات تخطيط الرحلات، وليس من فتح هذه الصفحة.\nكل اشتراك مدفوع مدته 30 يومًا من موافقة الإدارة.\nاختر الباقة المناسبة:`;
  await reply(env, userId, message, subscriptionKeyboard());
}
__name(subscriptionOverview, "subscriptionOverview");
async function subscriptionStatus(env, userId) {
  const rows = await env.DB.prepare("SELECT id, plan, status, created_at FROM subscription_requests WHERE telegram_user_id = ? ORDER BY id DESC LIMIT 5").bind(String(userId)).all();
  const list = (rows.results || []).map(r => `#${r.id} — ${PLANS[r.plan]?.name || r.plan} — ${r.status} — ${r.created_at}`);
  await reply(env, userId, list.length ? `📋 آخر طلباتك:\n${list.join("\n")}` : "ليس لديك طلبات اشتراك حتى الآن.", subscriptionKeyboard());
}
__name(subscriptionStatus, "subscriptionStatus");
async function previewSubscription(env, callback, planCode) {
  const userId = String(callback.from.id); const plan = PLANS[planCode];
  if (!plan || callback.message?.chat?.type !== "private" || String(callback.message.chat.id) !== userId) return;
  const message = `💎 تفاصيل الباقة\n\n${plan.name}\n💰 السعر: ${plan.price} ريال سعودي\n📅 المدة: 30 يومًا من موافقة الإدارة\n\n✨ المميزات:\n🗺️ تخطيط ${plan.routes} رحلات خلال كل 24 ساعة.\n🔄 يتجدد رصيد التخطيط بعد انتهاء نافذة الاستخدام (24 ساعة من أول محاولة).\n⚡ تخطيط المسارات مع محطات الشحن المتاحة.\n🌍 تخطيط الرحلات ضمن دول الخليج المدعومة.\n\nℹ️ البحث عن المحطات متاح أيضًا للمستخدم المجاني.\n🛡️ تخضع الرحلات لحدود حماية خدمة المسارات العامة.\n\nهل ترغب بتأكيد طلب الاشتراك؟`;
  await reply(env, userId, message, { inline_keyboard: [ [{ text: `✅ تأكيد الاشتراك — ${plan.price} ر.س`, callback_data: `sub_confirm:${planCode}` }], [{ text: "❌ تراجع عن الطلب", callback_data: "sub_back" }] ] });
}
__name(previewSubscription, "previewSubscription");
async function chooseSubscription(env, callback, planCode) {
  const userId = String(callback.from.id); const plan = PLANS[planCode];
  if (!plan || callback.message?.chat?.type !== "private" || String(callback.message.chat.id) !== userId) return;
  const existing = await env.DB.prepare("SELECT id FROM subscription_requests WHERE telegram_user_id = ? AND status IN ('AWAITING_RECEIPT','PENDING') ORDER BY id DESC LIMIT 1").bind(userId).first();
  if (existing) { await reply(env, userId, `⚠️ لديك طلب مفتوح رقم #${existing.id}. أرسل إيصال التحويل هنا لإكماله، أو انتظر مراجعة الإدارة.`); return; }
  const bank = String(env.BANK_TRANSFER_DETAILS || "").trim();
  if (!bank) { await reply(env, userId, "⏳ استقبال طلبات الاشتراك غير متاح مؤقتًا حتى تعتمد الإدارة بيانات التحويل البنكي."); return; }
  const inserted = await env.DB.prepare("INSERT INTO subscription_requests (telegram_user_id, telegram_username, customer_name, plan, amount_sar, status) VALUES (?, ?, ?, ?, ?, 'AWAITING_RECEIPT') RETURNING id").bind(userId, callback.from.username || null, [callback.from.first_name, callback.from.last_name].filter(Boolean).join(" ") || null, planCode, plan.price).first();
  await reply(env, userId, `💎 طلب اشتراك #${inserted.id}\nالباقة: ${plan.name}\nالمبلغ: ${plan.price} ريال سعودي\nالمدة: 30 يومًا من الموافقة\n\n🏦 بيانات التحويل:\n${bank}\n\n📸 بعد التحويل أرسل صورة الإيصال أو ملف PDF في هذه المحادثة.\n⚠️ لا يبدأ الاشتراك حتى تتأكد الإدارة من وصول المبلغ وتوافق على الطلب.`);
}
async function receiveSubscriptionReceipt(env, message) {
  if (!isPrivate(message)) return false;
  const userId = String(message.from?.id || "");
  if (!userId || userId !== String(message.chat.id)) return false;
  const photo = message.photo?.at(-1)?.file_id;
  const doc = message.document;
  const isPdf = doc?.mime_type === "application/pdf";
  if (!photo && !isPdf) return false;
  const pending = await env.DB.prepare("SELECT id, plan, amount_sar FROM subscription_requests WHERE telegram_user_id = ? AND status = 'AWAITING_RECEIPT' ORDER BY id DESC LIMIT 1").bind(userId).first();
  if (!pending) return false;
  const adminGroup = String(env.ADMIN_GROUP_ID || "").trim();
  if (!/^-\d+$/.test(adminGroup)) { await reply(env, userId, "⚠️ تعذر إرسال الإيصال إلى الإدارة حاليًا. أعد المحاولة لاحقًا."); return true; }
  const plan = PLANS[pending.plan];
  const caption = `💎 طلب اشتراك #${pending.id}\nالعميل: ${[message.from.first_name, message.from.last_name].filter(Boolean).join(" ")}\nالمستخدم: ${message.from.username ? "@" + message.from.username : "غير متوفر"}\nTelegram ID: ${userId}\nالباقة: ${plan?.name || pending.plan}\nالمبلغ: ${pending.amount_sar} ر.س\n\n⚠️ تحقق من وصول المبلغ إلى البنك قبل الموافقة.`;
  const method = photo ? "sendPhoto" : "sendDocument";
  const receiptId = photo || doc.file_id;
  await telegram(env.BOT_TOKEN, method, { chat_id: adminGroup, [photo ? "photo" : "document"]: receiptId, caption, reply_markup: { inline_keyboard: [[ { text: "✅ موافقة", callback_data: `sub_approve:${pending.id}` }, { text: "❌ رفض", callback_data: `sub_reject:${pending.id}` } ]] } });
  await env.DB.prepare("UPDATE subscription_requests SET status='PENDING', receipt_file_id=? WHERE id=? AND telegram_user_id=? AND status='AWAITING_RECEIPT'").bind(receiptId, pending.id, userId).run();
  await reply(env, userId, `✅ استلمنا إيصال الطلب #${pending.id} وأرسلناه للإدارة.\n⏳ ستصلتك رسالة بعد مراجعة التحويل.`);
  return true;
}
__name(receiveSubscriptionReceipt, "receiveSubscriptionReceipt");
function subscriptionDateSaudiParts(value) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, hourCycle: "h23" }).formatToParts(new Date(value));
  const part = (type) => parts.find((p) => p.type === type)?.value || "";
  const hour = Number(part("hour"));
  return { date: `${part("day")}/${part("month")}/${part("year")}`, time: `${String(hour % 12 || 12).padStart(2, "0")}:${part("minute")} ${hour < 12 ? "صباحًا" : "مساءً"}` };
}
__name(subscriptionDateSaudiParts, "subscriptionDateSaudiParts");
async function reviewSubscription(env, callback, approve, requestId) {
  const adminGroup = String(env.ADMIN_GROUP_ID || "");
  if (String(callback.from?.id) !== ADMIN_USER_ID || String(callback.message?.chat?.id) !== adminGroup) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "⛔ هذا الإجراء للمدير فقط.", show_alert: true }); return; }
  const row = await env.DB.prepare("SELECT * FROM subscription_requests WHERE id = ?").bind(requestId).first();
  if (!row || row.status !== "PENDING" || !PLANS[row.plan]) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "هذا الطلب تمت مراجعته أو غير صالح.", show_alert: true }); return; }
  const newStatus = approve ? "APPROVED" : "REJECTED";
  const updated = await env.DB.prepare("UPDATE subscription_requests SET status=?, admin_user_id=?, reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING' RETURNING id").bind(newStatus, ADMIN_USER_ID, requestId).first();
  if (!updated) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "تمت مراجعة الطلب بالفعل.", show_alert: true }); return; }
  let expiry = null; let activatedAt = null;
  if (approve) {
    const old = await env.DB.prepare("SELECT expires_at FROM subscriptions WHERE telegram_user_id=?").bind(row.telegram_user_id).first();
    const oldMs = Date.parse(old?.expires_at || ""); activatedAt = new Date();
    const startMs = Number.isFinite(oldMs) && oldMs > activatedAt.getTime() ? oldMs : activatedAt.getTime();
    expiry = new Date(startMs + 30 * 864e5).toISOString();
    await env.DB.prepare("INSERT INTO subscriptions (telegram_user_id,plan,daily_route_limit,started_at,expires_at,updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP,?,CURRENT_TIMESTAMP) ON CONFLICT(telegram_user_id) DO UPDATE SET plan=excluded.plan,daily_route_limit=excluded.daily_route_limit,started_at=excluded.started_at,expires_at=excluded.expires_at,updated_at=CURRENT_TIMESTAMP").bind(row.telegram_user_id, row.plan, PLANS[row.plan].routes, expiry).run();
  }
  await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: approve ? "تمت الموافقة" : "تم رفض الطلب" });
  await telegram(env.BOT_TOKEN, "editMessageReplyMarkup", { chat_id: adminGroup, message_id: callback.message.message_id, reply_markup: { inline_keyboard: [] } });
  try {
    if (approve) {
      const start = subscriptionDateSaudiParts(activatedAt); const end = subscriptionDateSaudiParts(expiry);
      await reply(env, row.telegram_user_id, `✅ تم تفعيل اشتراكك بنجاح!\n\n💎 الباقة: ${PLANS[row.plan].name}\n📅 تاريخ التفعيل: ${start.date}\n📅 تاريخ الانتهاء: ${end.date}\n\n⚡ مميزات اشتراكك:\n🗺️ تخطيط ${PLANS[row.plan].routes} رحلة خلال 24 ساعة.`);
    } else {
      await reply(env, row.telegram_user_id, `❌ تم رفض طلب الاشتراك #${requestId}.\nإذا كان هناك خطأ في التحويل، تواصل مع الإدارة.`);
    }
  } catch (e) { console.error("SUB_CUSTOMER_NOTIFICATION_FAILED", requestId, String(e)); }
}
__name(reviewSubscription, "reviewSubscription");
async function batteryEnsureTables(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS battery_calculator_state (chat_id TEXT PRIMARY KEY, route_km REAL NOT NULL, stage TEXT NOT NULL DEFAULT 'ready', capacity_kwh REAL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS battery_calculator_trials (telegram_user_id TEXT PRIMARY KEY, used INTEGER NOT NULL DEFAULT 0, used_at TEXT)`).run();
}
__name(batteryEnsureTables, "batteryEnsureTables");
async function batteryHasSubscription(db, userId) {
  const subscription = await db.prepare("SELECT plan, expires_at FROM subscriptions WHERE telegram_user_id = ?").bind(String(userId)).first();
  return Boolean(subscription && PLANS[subscription.plan] && Date.parse(subscription.expires_at || "") > Date.now());
}
__name(batteryHasSubscription, "batteryHasSubscription");
async function batteryCanUse(db, userId) {
  if (await batteryHasSubscription(db, userId)) return { allowed: true, paid: true };
  const trial = await db.prepare("SELECT used FROM battery_calculator_trials WHERE telegram_user_id = ?").bind(String(userId)).first();
  return { allowed: Number(trial?.used || 0) === 0, paid: false };
}
__name(batteryCanUse, "batteryCanUse");
async function batterySaveRoute(env, chat, km) {
  await batteryEnsureTables(env.DB);
  await env.DB.prepare(`INSERT INTO battery_calculator_state (chat_id, route_km, stage, capacity_kwh, updated_at) VALUES (?, ?, 'ready', NULL, CURRENT_TIMESTAMP) ON CONFLICT(chat_id) DO UPDATE SET route_km = excluded.route_km, stage = 'ready', capacity_kwh = NULL, updated_at = CURRENT_TIMESTAMP`).bind(String(chat), km).run();
  const access = await batteryCanUse(env.DB, chat);
  if (access.allowed) {
    await reply(env, chat, access.paid ? "🔋 حاسبة استهلاك البطارية متاحة ضمن اشتراكك." : "🎁 لديك تجربة مجانية واحدة لحاسبة استهلاك البطارية.", { inline_keyboard: [[{ text: access.paid ? "🔋 احسب استهلاك البطارية" : "🎁 تجربة مجانية - حساب البطارية", callback_data: "battery_start" }]] });
  }
}
__name(batterySaveRoute, "batterySaveRoute");
async function batteryStart(env, callback) {
  const chat = callback.message?.chat?.id; const userId = callback.from?.id;
  await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id });
  if (!chat || !userId || String(chat) !== String(userId)) return;
  await batteryEnsureTables(env.DB);
  const state = await env.DB.prepare("SELECT route_km FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).first();
  if (!state || !Number.isFinite(Number(state.route_km))) { await reply(env, chat, "⚠️ احسب رحلة جديدة أولا."); return; }
  const access = await batteryCanUse(env.DB, userId);
  if (!access.allowed) { await reply(env, chat, "🔒 انتهت تجربتك المجانية. اشترك للاستفادة من حاسبة البطارية.", { inline_keyboard: [[{ text: "⭐ عرض الاشتراكات", callback_data: "battery_subscribe" }]] }); return; }
  await env.DB.prepare(`UPDATE battery_calculator_state SET stage = 'capacity', capacity_kwh = NULL, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(String(chat)).run();
  await reply(env, chat, "🔋 أدخل سعة البطارية بالكيلوواط ساعة (kWh).\n\nمثال: 75 أو 100\n\nيمكنك إرسال /cancel للإلغاء.");
}
__name(batteryStart, "batteryStart");
async function batteryHandleText(env, chat, userId, text) {
  await batteryEnsureTables(env.DB);
  const state = await env.DB.prepare("SELECT * FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).first();
  if (!state || !["capacity", "consumption"].includes(state.stage)) return false;
  if (text === "/cancel") { await env.DB.prepare("UPDATE battery_calculator_state SET stage = 'ready' WHERE chat_id = ?").bind(String(chat)).run(); await reply(env, chat, "تم إلغاء حساب البطارية."); return true; }
  const value = Number(String(text).trim().replace(",", "."));
  if (state.stage === "capacity") {
    if (!Number.isFinite(value) || value < 5 || value > 250) { await reply(env, chat, "⚠️ أدخل سعة بطارية صحيحة بين 5 و250 kWh."); return true; }
    await env.DB.prepare(`UPDATE battery_calculator_state SET capacity_kwh = ?, stage = 'consumption', updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(value, String(chat)).run();
    await reply(env, chat, "⚡ أدخل معدل استهلاك سيارتك عند سرعة 120 كم/ساعة.\n\nالوحدة: kWh لكل 100 كم\nمثال: 22\n\nيمكنك إرسال /cancel للإلغاء."); return true;
  }
  if (!Number.isFinite(value) || value < 5 || value > 60) { await reply(env, chat, "⚠️ أدخل معدل استهلاك صحيحا بين 5 و60 kWh/100 km."); return true; }
  const capacity = Number(state.capacity_kwh); const distance = Number(state.route_km);
  if (!Number.isFinite(capacity) || !Number.isFinite(distance) || capacity <= 0 || distance <= 0) { await reply(env, chat, "⚠️ بيانات الرحلة غير مكتملة. ابدأ رحلة جديدة."); return true; }
  const required = distance * value / 100; const usedPercent = required / capacity * 100; const remainingPercent = 100 - usedPercent;
  const access = await batteryCanUse(env.DB, userId);
  if (!access.allowed) { await env.DB.prepare("UPDATE battery_calculator_state SET stage = 'ready' WHERE chat_id = ?").bind(String(chat)).run(); await reply(env, chat, "🔒 انتهت تجربتك المجانية. اشترك لاستخدام الحاسبة."); return true; }
  const batteryTrialClaimId = !access.paid ? crypto.randomUUID() : null;
  if (!access.paid) {
    await env.DB.prepare(`INSERT OR IGNORE INTO battery_calculator_trials (telegram_user_id, used) VALUES (?, 0)`).bind(String(userId)).run();
    const claim = await env.DB.prepare(`UPDATE battery_calculator_trials SET used = 1, used_at = ? WHERE telegram_user_id = ? AND used = 0`).bind(batteryTrialClaimId, String(userId)).run();
    if ((claim.meta?.changes ?? 0) !== 1) { await reply(env, chat, "🔒 تم استخدام التجربة المجانية مسبقا."); return true; }
  }
  await env.DB.prepare(`UPDATE battery_calculator_state SET stage = 'ready', updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(String(chat)).run();
  const f = (n) => n.toFixed(1);
  const result = ["🔋 نتيجة حساب استهلاك البطارية", "", "🛣️ مسافة الرحلة: " + f(distance) + " كم", "🚗 السرعة المفترضة: 120 كم/ساعة", "🔋 سعة البطارية: " + f(capacity) + " kWh", "⚡ معدل الاستهلاك: " + f(value) + " kWh/100 km", "🔻 الطاقة المطلوبة: " + f(required) + " kWh", "📊 نسبة البطارية المستهلكة: " + f(usedPercent) + "%", "🔋 المتبقي المتوقع: " + f(remainingPercent) + "%", "", remainingPercent < 10 ? "⚠️ ينصح بالتوقف للشحن أثناء الرحلة." : "✅ الاستهلاك التقديري ضمن سعة البطارية.", "", "ℹ️ الحساب يفترض الانطلاق بشحن 100% ودون توقف للشحن.", "النتيجة تقديرية وتتأثر بالحرارة والرياح والتكييف والتضاريس."].join("\n");
  try { await reply(env, chat, result); } catch (batterySendError) { if (batteryTrialClaimId) { await env.DB.prepare(`UPDATE battery_calculator_trials SET used = 0, used_at = NULL WHERE telegram_user_id = ? AND used = 1 AND used_at = ?`).bind(String(userId), batteryTrialClaimId).run(); } throw batterySendError; }
  return true;
}
__name(batteryHandleText, "batteryHandleText");
const BOT_RELEASE_VERSION = "5.19.4";
const BOT_RELEASE_MESSAGE = ["🆕 تحديث جديد لبوت محطات شحن الخليج", "", "⚡ تم تحديث القائمة الرئيسية لتسهيل الوصول للخدمات:", "", "🗺️ تخطيط الرحلة", "📍 أقرب محطة", "🔋 نوع الشاحن", "🌍 البحث عن محطة", "🛠️ الخدمات والبلاغات", "🎁 نقاطي ودعواتي", "", "✅ القائمة الجديدة جاهزة للاستخدام.", "لا تحتاج إلى كتابة /start."].join("\n");
async function notifyReleaseOnce(env, message) {
  if (!message) {
    if (!env.DB || !env.BOT_TOKEN) return;
    const users = await env.DB.prepare("SELECT chat_id FROM bot_release_notices WHERE release_version != ?").bind(BOT_RELEASE_VERSION).all();
    for (const user of users.results || []) {
      try {
        await reply(env, user.chat_id, BOT_RELEASE_MESSAGE, MAIN_MENU);
        await env.DB.prepare("INSERT INTO bot_release_notices (chat_id, release_version) VALUES (?, ?) ON CONFLICT(chat_id, release_version) DO NOTHING").bind(user.chat_id, BOT_RELEASE_VERSION).run();
      } catch (e) { console.error("Broadcast failed", user.chat_id, String(e)); }
    }
    return;
  }
  if (message.chat?.type !== "private") return;
  const chatId = String(message.chat.id);
  try {
    const claim = await env.DB.prepare(`INSERT INTO bot_release_notices (chat_id, release_version) VALUES (?, ?) ON CONFLICT(chat_id, release_version) DO NOTHING`).bind(chatId, BOT_RELEASE_VERSION).run();
    if (Number(claim.meta?.changes ?? 0) !== 1) return;
  } catch (error) { console.error("Release notification database error:", error); return; }
  try { await reply(env, message.chat.id, BOT_RELEASE_MESSAGE, MAIN_MENU); } catch (error) { console.error("Release notification delivery error:", error); }
}
async function handleMessage(env, message) {
  const chat = message.chat.id;
  const rawText = (message.text || "").trim();
  const text = /^\/start\s+ref_\d{1,20}$/.test(rawText) ? "/start" : rawText;
  if (message.chat.type === "group" || message.chat.type === "supergroup") {
    if (/^\/chatid(?:@GCC_EV_Chargers_bot)?(?:\s|$)/i.test(text)) { await telegram(env.BOT_TOKEN, "sendMessage", { chat_id: chat, text: `🆔 رقم مجموعة الإدارة (Chat ID):\n${chat}` }); }
    return;
  }
  await rewardRegister(env,message);
  await rewardActivateQueued(env,String(message.from.id));
  if(await rewardAdmin(env,message))return;
  if(text===REWARD_LABEL || text==='/rewards') {await rewardHome(env,message.from.id);return;}
  await notifyReleaseOnce(env, message);
  const v518NavigationButtons = ["🔋 نوع الشاحن","🌍 البحث عن محطة","🛠️ الخدمات والبلاغات","🌍 البحث حسب الدولة","🔍 البحث عن محطة","⚡ شحن سريع DC","🔌 شحن عادي AC","🔋 جميع أنواع الشحن","📢 تحديثات واتساب","💎 عضويتي والاشتراكات","➕ إضافة محطة جديدة","🛠️ الإبلاغ عن مشكلة","📍 أقرب محطة", "🎁 نقاطي ودعواتي"];
  if (v518NavigationButtons.includes(text)) {
    await clearTrip(env.DB, chat);
    await batteryEnsureTables(env.DB);
    await env.DB.prepare("DELETE FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).run();
    await env.DB.prepare("UPDATE user_search_state SET search_active = 0, search_query = NULL WHERE chat_id = ?").bind(String(chat)).run();
  }
  if (["🔋 نوع الشاحن","🌍 البحث عن محطة","🛠️ الخدمات والبلاغات","🌍 البحث حسب الدولة","🔋 جميع أنواع الشحن","📢 تحديثات واتساب"].includes(text)) {
    await env.DB.prepare("UPDATE user_search_state SET search_active = 0, search_query = NULL WHERE chat_id = ?").bind(String(chat)).run();
  }
  if (text === "🔋 نوع الشاحن") { await reply(env, chat, "🔋 اختر نوع الشاحن:", CHARGER_TYPE_MENU); return; }
  if (text === "🌍 البحث عن محطة") { 
    await reply(env, chat, "🌍 اختر طريقة البحث:", SEARCH_MENU); 
    return; 
  }

  if (text === "🔙 رجوع") {
    const state = await getState(env.DB, chat);
    if (state.country) {
      await saveState(env.DB, chat, null, "ALL");
      await reply(env, chat, "🌍 اختر الدولة:", COUNTRY_MENU);
    } else {
      await reply(env, chat, "🏠 القائمة الرئيسية", MAIN_MENU);
    }
    return;
  }  if (text === "🔙 رجوع") {
    // التحقق مما إذا كان المستخدم في قائمة الدول أم لا
    const activeTrip = await getTrip(env.DB, chat);
    // إذا كان المستخدم قد اختار دولة للتو (موجودة في الحالة)
    const state = await getState(env.DB, chat);
    if (state.country) {
      // إذا كان في سياق دولة، نرجع لقائمة البحث
      await saveState(env.DB, chat, null, "ALL"); // مسح الدولة المختارة
      await reply(env, chat, "🌍 اختر طريقة البحث:", SEARCH_MENU);
    } else {
      // إذا لم يكن في سياق دولة، نرجع للقائمة الرئيسية
      await reply(env, chat, "🏠 القائمة الرئيسية", MAIN_MENU);
    }
    return;
  }
  if (text === "🛠️ الخدمات والبلاغات") { await reply(env, chat, "🛠️ اختر الخدمة المطلوبة:", SERVICES_MENU); return; }
  if (text === "📢 تحديثات واتساب") { await reply(env, chat, "📢 انضم إلى مجموعة تحديثات GCC EV Chargers على واتساب.\n\nننشر فيها تحديثات خريطة محطات الشحن وميزات البوت الجديدة.\n\nالمجموعة مخصصة للإعلانات والتحديثات فقط.", { inline_keyboard: [[{ text: "📢 الانضمام إلى مجموعة واتساب", url: WHATSAPP_UPDATES_URL }]] }); return; }
  if (text === "🌍 البحث حسب الدولة") { await saveState(env.DB, chat, null, "ALL"); await reply(env, chat, "🌍 اختر الدولة:", COUNTRY_MENU); return; }
  if (text === "🔋 جميع أنواع الشحن") { await saveState(env.DB, chat, null, "ALL"); await reply(env, chat, "✅ تم اختيار جميع أنواع الشحن.\n\n📍 شارك موقعك لعرض أقرب المحطات.", CHARGER_TYPE_MENU); return; }
  if (text === MEMBERSHIP_MENU_LABEL || text === "/subscription") { await subscriptionOverview(env, String(message.from.id)); return; }
  if (await receiveSubscriptionReceipt(env, message)) return;
  if (text !== "/start" && text !== "🏠 القائمة الرئيسية" && text !== "🆕🗺️ تخطيط الرحلة" && text !== "🗺️ تخطيط الرحلة") {
    if (await batteryHandleText(env, chat, message.from.id, text)) return;
  }
  if (text === "/start" || text === "🏠 القائمة الرئيسية") {
    await batteryEnsureTables(env.DB);
    await env.DB.prepare("DELETE FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).run();
    await clearTrip(env.DB, chat);
    await clearTripResults(env.DB, chat);
    await saveState(env.DB, chat, null, "ALL");
    await reply(env, chat, "⚡ أهلا بك في دليل محطات شحن السيارات الكهربائية بالخليج\n\n🌍 اكتشف محطات الشحن في السعودية والإمارات وقطر والكويت والبحرين وعُمان.\n\n📍 ابحث عن أقرب محطة شحن، وتعرّف على تفاصيلها وموقعها.\n\n👇 استكشف الخدمات المتاحة من القائمة أدناه.");
    await reply(env, chat, "🏠 القائمة الرئيسية", MAIN_MENU);
    return;
  }
  if (text === "🆕🗺️ تخطيط الرحلة" || text === "🗺️ تخطيط الرحلة") {
    await batteryEnsureTables(env.DB);
    await env.DB.prepare("DELETE FROM battery_calculator_state WHERE chat_id = ?").bind(String(chat)).run();
    await startTrip(env, chat); return;
  }
  if (text === "🎯 محطات الشحن حسب البطارية" || text === "⚡ جميع المحطات على الطريق") {
    await ensureTripResultsTable(env.DB);
    const row=await env.DB.prepare("SELECT station_ids FROM trip_planner_results WHERE chat_id = ?").bind(String(chat)).first();
    if(!row){await reply(env,chat,"لا توجد رحلة محفوظة. ابدأ تخطيط رحلة جديدة.");return;}
    const data=JSON.parse(row.station_ids);
    if(Array.isArray(data)){await reply(env,chat,"نتائج الرحلة قديمة؛ ابدأ رحلة جديدة لاستخدام عرض البطارية.");return;}
    data.view=text.startsWith("🎯")?"BATTERY":"ALL";
    await env.DB.prepare("UPDATE trip_planner_results SET station_ids = ?, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?").bind(JSON.stringify(data),String(chat)).run();
    const items=tripDisplayItems(data);
    if(!items.length){await reply(env,chat,data.view==="BATTERY"&&data.battery?.finish>=20?"✅ حسب التقدير، يمكنك الوصول مع احتياطي 20% دون الحاجة إلى شحن. تستطيع عرض جميع المحطات إذا رغبت.":"⚠️ لا توجد محطات مناسبة ضمن نطاق البطارية والاحتياطي المحدد. لا تعتمد على هذا المسار دون خطة شحن بديلة.",TRIP_DISPLAY_MENU);return;}
    await reply(env,chat,`🔎 عرض ${items.length} محطة (${data.view==="BATTERY"?"حسب البطارية":"جميع المحطات"}).`,TRIP_DISPLAY_MENU);
    await showTripPage(env,chat,0); return;
  }
  const activeTrip = await getTrip(env.DB, chat);
  if (message.location && activeTrip && /^(start|end)_(choose|text)$/.test(activeTrip.step)) {
    const lat = Number(message.location.latitude); const lon = Number(message.location.longitude);
    if (!isGccPoint(lat, lon)) { await reply(env, chat, "⚠️ تخطيط الرحلات متاح حاليًا داخل نطاق دول الخليج فقط.", TRIP_POINT_MENU); return; }
    await acceptTripPoint(env, chat, activeTrip, { lat, lon, name: "الموقع المحدد", approximate: false }); return;
  }
  if (activeTrip && text !== "/start" && text !== "🏠 القائمة الرئيسية") { await handleTripText(env, chat, text, activeTrip); return; }
  if (message.location) {
    const lat = Number(message.location.latitude); const lon = Number(message.location.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) { return; }
      await saveUserLocation(env.DB, chat, lat, lon);
    const state = await getState(env.DB, chat);
    
    if (state.country) {
      // إذا كان المستخدم قد اختار دولة، نبحث عن المحطات داخل تلك الدولة
      const countryStations = await env.DB.prepare("SELECT * FROM stations WHERE country = ?").bind(state.country).all();
      const valid = (countryStations.results || []).filter(isEligible).map(s => ({
        ...s,
        km: distanceKm(lat, lon, Number(s.latitude), Number(s.longitude))
      })).sort((a, b) => a.km - b.km);
      
      if (!valid.length) {
        await reply(env, chat, `⚠️ لا توجد محطات مسجلة في ${state.country} حالياً.`);
        return;
      }
      
      const page = valid.slice(0, 4);
      const displayStations = page.slice(0, 3);
      const hasMore = page.length > 3;
      const heading = `📍 أقرب المحطات لك في ${state.country}`;
      
      await reply(env, chat, pageMessage(displayStations, 0, heading), directionsKeyboard(displayStations, 0, hasMore));
      return;
    }    
    // إذا لم يحدد المستخدم دولة، نبحث في جميع المحطات
    const page = await findPage(env.DB, lat, lon, state, 0);
    if (!page.stations.length) { await reply(env, chat, "لم نجد محطات قريبة من موقعك."); return; }
    const heading = "⚡ أقرب 3 محطات شحن لموقعك";
    await reply(env, chat, pageMessage(page.stations, 0, heading), directionsKeyboard(page.stations, 0, page.hasMore)); return;
  }
  if (text === "🌍 البحث حسب الدولة") { await saveState(env.DB, chat, null, "ALL"); await reply(env, chat, "🌍 اختر الدولة:", COUNTRY_MENU); return; }
  if (text === "🔍 البحث عن محطة") {
    await saveState(env.DB, chat, null, "ALL");
    await env.DB.prepare(`UPDATE user_search_state SET search_active = 1, search_query = NULL, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(String(chat)).run();
    await reply(env, chat, "🔍 البحث عن محطة شحن\n\nاكتب رقم المحطة أو اسم المدينة أو المحطة أو الشركة المشغّلة.\n\nأمثلة:\n🔢 4000\n🏙️ الخبر\n⚡ EVIQ\n📍 SASCO\n⚡ Mall of Qatar\n🇶🇦 قطر مول\n\nللإلغاء اضغط 🏠 القائمة الرئيسية.", SEARCH_MENU); return;
  }
     if (text === "🔙 رجوع") {
    const state = await getState(env.DB, chat);
    if (state.country) {
      await saveState(env.DB, chat, null, "ALL");
      await reply(env, chat, "🌍 اختر الدولة:", COUNTRY_MENU);
    } else {
      await reply(env, chat, "🏠 القائمة الرئيسية", MAIN_MENU);
    }
    return;
  }

  if (Object.prototype.hasOwnProperty.call(COUNTRIES, text)) {
    const country = COUNTRIES[text]; 
    await saveState(env.DB, chat, country, "ALL");
    await reply(env, chat, `✅ اخترت ${country}.\n\n📍 اضغط "مشاركة موقعي" للبحث عن أقرب 3 محطات داخل الدولة.`, {
      keyboard: [
        [{ text: "📍 مشاركة موقعي", request_location: true }],
       [{ text: "🔙 رجوع" }, { text: "🏠 القائمة الرئيسية" }]

      ],
      resize_keyboard: true,
      is_persistent: true
    }); 
    return;
  }
  if (text === "📍 أقرب محطة") { await saveState(env.DB, chat, null, "ALL"); await reply(env, chat, "📍 اضغط مشاركة موقعي للبحث عن أقرب المحطات."); return; }
  if (text === "⚡ شحن سريع DC" || text === "🔌 شحن عادي AC") {
    const mode = text.includes("DC") ? "DC" : "AC"; await saveState(env.DB, chat, null, mode);
    await reply(env, chat, `✅ تم اختيار الشحن ${mode}.\n\n📍 اضغط مشاركة موقعي لعرض أقرب 3 محطات.`, CHARGER_TYPE_MENU); return;
  }
  if (text === "🛠️ الإبلاغ عن مشكلة" || text === "➕ إضافة محطة جديدة") {
    await saveState(env.DB, chat, null, "ALL");
    const title = text === "🛠️ الإبلاغ عن مشكلة" ? "🛠️ نموذج البلاغات" : "➕ إضافة محطة شحن جديدة";
    await reply(env, chat, `${title}\n\nافتح النموذج واختر نوع البلاغ المناسب.\nنفس النموذج مخصص للأعطال وإضافة المحطات.`, { inline_keyboard: [[{ text: "📝 فتح نموذج Google", url: FORM_URL }]] }); return;
  }
  const searchState = await env.DB.prepare(`SELECT search_active FROM user_search_state WHERE chat_id = ?`).bind(String(chat)).first();
  if (Number(searchState?.search_active) === 1 && text && !text.startsWith("/")) {
    const keyword = text.slice(0, 100); const page = await searchStations(env.DB, keyword, 0);
    await env.DB.prepare(`UPDATE user_search_state SET search_query = ?, page_offset = 0, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`).bind(keyword, String(chat)).run();
    if (!page.stations.length) { await reply(env, chat, `🔍 لم نجد محطات تطابق: ${keyword}\n\nجرّب رقم المحطة أو اسمها بالعربية أو الإنجليزية.`); return; }
    await reply(env, chat, pageMessage(page.stations, 0, `🔍 نتائج البحث عن: ${keyword}`), directionsKeyboard(page.stations, 0, page.hasMore, "search_more")); return;
  }
  await reply(env, chat, "اختر إحدى الخدمات من القائمة الرئيسية.");
}
__name(handleMessage, "handleMessage");
async function handleSearchMore(env, callback) {
  const chat = callback.message?.chat?.id; if (!chat) return;
  const match = /^search_more:(\d+)$/.exec(callback.data || ""); if (!match) return;
  const requestedOffset = Number(match[1]);
  if (!Number.isSafeInteger(requestedOffset) || requestedOffset < 3 || requestedOffset > 3000 || requestedOffset % 3 !== 0) return;
  const state = await env.DB.prepare(`SELECT search_active, search_query, page_offset FROM user_search_state WHERE chat_id = ?`).bind(String(chat)).first();
  if (Number(state?.search_active) !== 1 || !state?.search_query) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "ابدأ بحثًا جديدًا من القائمة." }); return; }
  const currentOffset = Number(state.page_offset || 0);
  if (requestedOffset !== currentOffset + 3) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "هذه صفحة قديمة. استخدم أحدث النتائج." }); return; }
  const page = await searchStations(env.DB, state.search_query, requestedOffset);
  if (!page.stations.length) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "لا توجد نتائج إضافية." }); return; }
  const update = await env.DB.prepare(`UPDATE user_search_state SET page_offset = ?, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ? AND page_offset = ? AND search_active = 1 AND search_query = ?`).bind(requestedOffset, String(chat), currentOffset, state.search_query).run();
  if ((update.meta?.changes ?? 0) !== 1) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "تم عرض هذه الصفحة سابقًا." }); return; }
  await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id });
  await reply(env, chat, pageMessage(page.stations, requestedOffset, `🔍 نتائج إضافية: ${state.search_query}`), directionsKeyboard(page.stations, requestedOffset, page.hasMore, "search_more"));
}
__name(handleSearchMore, "handleSearchMore");
async function handleMoreStations(env, callback) {
  const chat = callback.message?.chat?.id; if (!chat) return;
  const match = /^more_stations:(\d+)$/.exec(callback.data || ""); if (!match) return;
  const requestedOffset = Number(match[1]);
  if (!Number.isSafeInteger(requestedOffset) || requestedOffset < 3 || requestedOffset > 3000 || requestedOffset % 3 !== 0) return;
  const state = await getState(env.DB, chat);
  if (state.last_latitude == null || state.last_longitude == null) { await reply(env, chat, "📍 أرسل موقعك أولًا لعرض المزيد من المحطات."); return; }
  const currentOffset = Number(state.page_offset || 0);
  if (requestedOffset !== currentOffset + 3) { await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "هذه صفحة قديمة. استخدم زر عرض المزيد في أحدث النتائج.", show_alert: false }); return; }
  const page = await findPage(env.DB, Number(state.last_latitude), Number(state.last_longitude), state, requestedOffset);
  if (!page.stations.length) {
    await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "وصلت إلى آخر محطة متاحة." });
    return;
  }
  const update = await env.DB.prepare(`
    UPDATE user_search_state
    SET page_offset = ?, updated_at = CURRENT_TIMESTAMP
    WHERE chat_id = ? AND page_offset = ? AND last_latitude IS NOT NULL AND last_longitude IS NOT NULL
  `).bind(requestedOffset, String(chat), currentOffset).run();
  if ((update.meta?.changes ?? 0) !== 1) {
    await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id, text: "تم عرض هذه الصفحة سابقًا." });
    return;
  }
  await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: callback.id });
  await reply(env, chat, pageMessage(page.stations, requestedOffset, "⚡ محطات شحن إضافية"), directionsKeyboard(page.stations, requestedOffset, page.hasMore));
}
__name(handleMoreStations, "handleMoreStations");

var GeoRateLimiter = class extends DurableObject {
  static { __name(this, "GeoRateLimiter"); }
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
  }
  async acquire() {
    return this.ctx.storage.transaction(async (txn) => {
      const now = Date.now();
      const next = Number(await txn.get("nextRequestAt") || 0);
      if (now < next) return { allowed: false, retryAfterMs: next - now };
      await txn.put("nextRequestAt", now + 1100);
      return { allowed: true };
    });
  }
};

var GCC_EV_Chargers_V5_12_default = {
  async scheduled(event, env, ctx) {
    const task = async () => {
      await notifyReleaseOnce(env, null);
      await rewardSchema(env.DB);
      const queued = await env.DB.prepare("SELECT user_id FROM reward_redemptions WHERE status='QUEUED' ORDER BY id LIMIT 100").all();
      for (const row of queued.results || []) {
        try { await rewardActivateQueued(env, row.user_id); } catch (e) { console.error('REWARD_QUEUE_CRON', String(row.user_id), String(e)); }
      }
      const expiring = await env.DB.prepare(`
        SELECT c.id, c.user_id, c.remaining, c.expires_at FROM reward_credits c
        WHERE c.status='AVAILABLE' AND c.remaining>0
          AND c.expires_at>CURRENT_TIMESTAMP AND c.expires_at<=datetime('now','+30 days')
          AND NOT EXISTS(SELECT 1 FROM reward_notices n WHERE n.credit_id=c.id)
        ORDER BY c.id LIMIT 100
      `).all();
      for (const credit of expiring.results || []) {
        try {
          await telegram(env.BOT_TOKEN, 'sendMessage', { chat_id: credit.user_id, text: `⏰ تنبيه: لديك ${credit.remaining} نقطة تنتهي صلاحيتها في ${credit.expires_at}. يمكنك استبدالها من 🎁 نقاطي ودعواتي.` });
          await env.DB.prepare('INSERT OR IGNORE INTO reward_notices(credit_id) VALUES(?)').bind(credit.id).run();
        } catch (e) { console.error('REWARD_EXPIRY_NOTICE_FAILED', credit.id, String(e)); }
      }
    };
    if (ctx?.waitUntil) ctx.waitUntil(task()); else await task();
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/test-city" && env.TEST_MODE === "true") {
      const city = url.searchParams.get("name") || "";
      const result = await findCityPoint(null, city, env);
      return Response.json(result);
    }
    if (request.method === "GET" && url.pathname === "/") {
      if (!env.DB) return new Response("Database binding missing", { status: 503 });
      try {
        const row = await env.DB.prepare("SELECT COUNT(*) AS total FROM stations").first();
        return new Response(`GCC EV Chargers Bot is running! Stations: ${row.total}`);
      } catch (error) {
        console.error("D1 count error", error);
        return new Response("Database error", { status: 503 });
      }
    }
    if (request.method !== "POST" || url.pathname !== "/webhook") return new Response("Not Found", { status: 404 });
    if (!env.BOT_TOKEN || !env.WEBHOOK_SECRET || !env.DB) return new Response("Configuration missing", { status: 503 });
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET) return new Response("Forbidden", { status: 403 });
    let update;
    try { update = await request.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }
    try {
      if (update.callback_query) {
        const callbackData = update.callback_query.data || "";
        if (/^reward_choose:(SILVER|GOLD|VIP)$/.test(callbackData)) {
          await telegram(env.BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id });
          await rewardPreview(env, update.callback_query, callbackData.split(':')[1]);
        } else if (/^reward_confirm:(SILVER|GOLD|VIP)$/.test(callbackData)) {
          await telegram(env.BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id });
          await rewardRedeem(env, update.callback_query, callbackData.split(':')[1]);
        } else if (callbackData === 'reward_home') {
          await telegram(env.BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id });
          await rewardHome(env, update.callback_query.from.id);
        } else if (callbackData === 'reward_history') {
          await telegram(env.BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id });
          await rewardHistory(env, update.callback_query.from.id);
        } else if (/^sub_plan:(SILVER|GOLD|VIP)$/.test(callbackData)) {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
          await previewSubscription(env, update.callback_query, callbackData.split(":")[1]);
        } else if (/^sub_confirm:(SILVER|GOLD|VIP)$/.test(callbackData)) {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
          await chooseSubscription(env, update.callback_query, callbackData.split(":")[1]);
        } else if (callbackData === "sub_back") {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
          if (update.callback_query.message?.chat?.type === "private" && String(update.callback_query.message.chat.id) === String(update.callback_query.from.id)) {
            await subscriptionOverview(env, String(update.callback_query.from.id));
          }
        } else if (callbackData === "sub_status") {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
          if (update.callback_query.message?.chat?.type === "private" && String(update.callback_query.message.chat.id) === String(update.callback_query.from.id)) await subscriptionStatus(env, update.callback_query.from.id);
        } else if (/^sub_(approve|reject):\d+$/.test(callbackData)) {
          const m = /^sub_(approve|reject):(\d+)$/.exec(callbackData);
          await reviewSubscription(env, update.callback_query, m[1] === "approve", Number(m[2]));
        } else if (callbackData.startsWith("search_more:")) {
          await handleSearchMore(env, update.callback_query);
        } else if (callbackData === "battery_start") {
          await batteryStart(env, update.callback_query);
        } else if (callbackData === "battery_subscribe") {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
          await subscriptionOverview(env, String(update.callback_query.from.id));
        } else if (callbackData.startsWith("trip_more:")) {
          await handleTripMore(env, update.callback_query);
        } else if (callbackData.startsWith("more_stations:")) {
          await handleMoreStations(env, update.callback_query);
        } else {
          await telegram(env.BOT_TOKEN, "answerCallbackQuery", { callback_query_id: update.callback_query.id });
        }
        return new Response("OK");
      }
      if (!update.message?.chat?.id) return new Response("OK");
      await handleMessage(env, update.message);
      return new Response("OK");
    } catch (error) {
      console.error("Bot processing error", error);
      return new Response("Processing error", { status: 500 });
    }
  }
};

export {
  GeoRateLimiter,
  GCC_EV_Chargers_V5_12_default as default
};
