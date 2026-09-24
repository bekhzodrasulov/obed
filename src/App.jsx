import { useState, useMemo } from "react";

const DISHES = [
  { id: 1, name: "Плов по-ферганcки", emoji: "🍛", cook: "Дилноза", kind: "home", type: "Второе", price: 38000, mins: 45, desc: "Говядина, зира, морковь", rating: 4.9 },
  { id: 2, name: "Лагман домашний", emoji: "🍜", cook: "Дилноза", kind: "home", type: "Первое", price: 35000, mins: 50, desc: "Ручная лапша, овощи", rating: 4.8 },
  { id: 3, name: "Манты (6 шт.)", emoji: "🥟", cook: "Малика", kind: "home", type: "Второе", price: 36000, mins: 55, desc: "Мясо и тыква", rating: 4.9 },
  { id: 4, name: "Мастава", emoji: "🍲", cook: "Малика", kind: "home", type: "Первое", price: 30000, mins: 40, desc: "Рис, овощи, катык", rating: 4.7 },
  { id: 5, name: "Самса из тандыра", emoji: "🥐", cook: "Дилноза", kind: "home", type: "Выпечка", price: 9000, mins: 40, desc: "Мясо и лук, 1 шт.", rating: 4.8 },
  { id: 6, name: "Салат «Ачичук»", emoji: "🥗", cook: "Азиза", kind: "home", type: "Салат", price: 16000, mins: 30, desc: "Томаты, лук, зелень", rating: 4.6 },
  { id: 7, name: "Медовик (кусок)", emoji: "🍰", cook: "Азиза", kind: "home", type: "Десерт", price: 22000, mins: 60, desc: "Домашний, на сметане", rating: 4.9 },
  { id: 8, name: "Бизнес-ланч «Классика»", emoji: "🍱", cook: "Bon Appétit Events", kind: "catering", type: "Второе", price: 45000, mins: 60, desc: "Салат, суп, горячее", rating: 4.7 },
  { id: 9, name: "Ланч-бокс «Веган»", emoji: "🥙", cook: "Green Lunch Box", kind: "catering", type: "Второе", price: 52000, mins: 45, desc: "Хумус, овощи, киноа", rating: 4.6 },
  { id: 10, name: "Шашлык микс", emoji: "🍢", cook: "Samarkand Catering", kind: "catering", type: "Второе", price: 65000, mins: 70, desc: "Баранина, курица, люля", rating: 4.8 },
];
const TYPES = ["Все", "Первое", "Второе", "Салат", "Выпечка", "Десерт"];
const PRICES = [[0, "Любая цена"], [20000, "до 20 000"], [40000, "до 40 000"], [60000, "до 60 000"]];
const TIMES = [[0, "Любое время"], [40, "до 40 мин"], [50, "до 50 мин"], [60, "до 60 мин"]];
const PAY = [["payme", "Payme"], ["click", "Click"], ["card", "Карта Uzcard / Humo"], ["cash", "Наличными курьеру"]];
const STEPS = ["Принят", "Готовится", "В пути", "Доставлен"];
const DOT = [[24, 118], [90, 95], [170, 58], [272, 32]];

const money = (n) => n.toLocaleString("ru-RU").replace(/,/g, " ") + " сум";

function LocationSheet({ office, addr, company, floor, onSave, onClose }) {
  const [a, setA] = useState(addr);
  const [c, setC] = useState(company);
  const [fl, setFl] = useState(floor);
  const locate = () => {
    const fallback = () => setA("Ташкент, Юнусабадский район");
    if (!navigator.geolocation) return fallback();
    navigator.geolocation.getCurrentPosition(
      (p) => setA(`Моя геопозиция (${p.coords.latitude.toFixed(3)}, ${p.coords.longitude.toFixed(3)})`),
      fallback
    );
  };
  return (
    <div className="sheet" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div>
        <h2>Куда доставить?</h2>
        <label>Адрес</label>
        <input value={a} onChange={(e) => setA(e.target.value)} placeholder="Улица, дом, ориентир" />
        <button className="btn alt" style={{ marginTop: 8 }} onClick={locate}>📍 Определить моё местоположение</button>
        {office && (
          <>
            <label>Название компании</label>
            <input value={c} onChange={(e) => setC(e.target.value)} placeholder="Например: ООО «Технопарк»" />
            <label>Этаж / офис</label>
            <input value={fl} onChange={(e) => setFl(e.target.value)} placeholder="3 этаж, офис 12" />
          </>
        )}
        <button className="btn" style={{ marginTop: 16 }} onClick={() => onSave({ addr: a, company: c, floor: fl })}>Сохранить</button>
      </div>
    </div>
  );
}

function Catalog({ cart, setQty }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("Все");
  const [maxp, setMaxp] = useState(0);
  const [maxt, setMaxt] = useState(0);
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return DISHES.filter((d) =>
      (type === "Все" || d.type === type) &&
      (!maxp || d.price <= maxp) &&
      (!maxt || d.mins <= maxt) &&
      (!s || (d.name + d.cook + d.desc).toLowerCase().includes(s))
    );
  }, [q, type, maxp, maxt]);

  return (
    <>
      <input className="srch" type="search" placeholder="Найти блюдо или повара" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tabs">
        {TYPES.map((t) => (
          <button key={t} className={"chip" + (type === t ? " on" : "")} onClick={() => setType(t)}>{t}</button>
        ))}
      </div>
      <div className="row2">
        <select aria-label="Цена" value={maxp} onChange={(e) => setMaxp(+e.target.value)}>
          {PRICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select aria-label="Время доставки" value={maxt} onChange={(e) => setMaxt(+e.target.value)}>
          {TIMES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {!list.length && <div className="empty"><div style={{ fontSize: 44 }}>🔎</div><p>Ничего не найдено. Измените запрос или фильтры.</p></div>}
      {list.map((d) => (
        <div className="card" key={d.id}>
          <div className="ava">{d.emoji}</div>
          <div style={{ flex: 1 }}>
            <h3>{d.name}</h3>
            <p>{d.desc}</p>
            <p>{d.kind === "home" ? "Домашняя кухня" : "Кейтеринг"}: {d.cook} · ⭐ {d.rating}</p>
            <span className="tag">{money(d.price)} · {d.mins} мин</span>
          </div>
          <Qty n={cart[d.id] || 0} onChange={(delta) => setQty(d.id, delta)} />
        </div>
      ))}
      <div style={{ height: 60 }} />
    </>
  );
}

function Qty({ n, onChange }) {
  return (
    <div className="qty">
      {n > 0 && (
        <>
          <button className="min" aria-label="Убрать" onClick={() => onChange(-1)}>−</button>
          <b>{n}</b>
        </>
      )}
      <button aria-label="Добавить" onClick={() => onChange(1)}>+</button>
    </div>
  );
}

function Cart({ cart, setQty, office, loc, pay, setPay, note, setNote, total, delivery, onPlace, onLoc, onCatalog }) {
  const ids = Object.keys(cart);
  if (!ids.length)
    return (
      <>
        <div className="empty"><div style={{ fontSize: 48 }}>🛒</div><p>Корзина пуста. Добавьте блюда из каталога.</p></div>
        <button className="btn" onClick={onCatalog}>Выбрать блюда</button>
      </>
    );
  return (
    <>
      <h2>Ваш заказ</h2>
      <p className="sub">Можно взять блюда от разных поваров, доставим одним заказом.</p>
      {ids.map((id) => {
        const d = DISHES.find((x) => x.id === +id);
        return (
          <div className="item" key={id}>
            <div><b>{d.name}</b><small>{d.cook} · {money(d.price)}</small></div>
            <Qty n={cart[id]} onChange={(delta) => setQty(d.id, delta)} />
          </div>
        );
      })}
      <label>Адрес доставки</label>
      <button className="card" style={{ margin: 0 }} onClick={onLoc}>
        <span>📍</span>
        <div>
          <b>{loc.addr || "Укажите адрес"}</b>
          {office && <p>{loc.company || "Укажите компанию"}{loc.floor ? ", " + loc.floor : ""}</p>}
        </div>
      </button>
      <label>Оплата онлайн</label>
      <select value={pay} onChange={(e) => setPay(e.target.value)}>
        {PAY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <label>Комментарий курьеру</label>
      <input placeholder="Этаж, ресепшн, время" value={note} onChange={(e) => setNote(e.target.value)} />
      <div style={{ margin: "16px 0" }}>
        <div className="sum"><span>Блюда</span><span>{money(total)}</span></div>
        <div className="sum"><span>Доставка</span><span>{delivery ? money(delivery) : "Бесплатно в офис"}</span></div>
        <div className="sum t"><span>Итого</span><span>{money(total + delivery)}</span></div>
      </div>
      <button className="btn" onClick={onPlace}>{pay === "cash" ? "Оформить заказ" : "Оплатить " + money(total + delivery)}</button>
    </>
  );
}

function Orders({ orders }) {
  const [filter, setFilter] = useState("all");
  const companies = [...new Set(orders.filter((o) => o.company).map((o) => o.company))];
  const shown = orders.filter((o) => filter === "all" || o.company === filter);
  return (
    <>
      <h2>Мои заказы</h2>
      <p className="sub">Статус обновляется автоматически.</p>
      {companies.length > 0 && (
        <div className="tabs">
          <button className={"chip" + (filter === "all" ? " on" : "")} onClick={() => setFilter("all")}>Все</button>
          {companies.map((c) => (
            <button key={c} className={"chip" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>🏢 {c}</button>
          ))}
        </div>
      )}
      {!shown.length && <div className="empty"><div style={{ fontSize: 48 }}>📦</div><p>Заказов пока нет. Оформите первый, и он появится здесь.</p></div>}
      {shown.map((o) => (
        <div className="card" style={{ display: "block" }} key={o.id}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="ava">🍱</div>
            <div style={{ flex: 1 }}>
              <h3>№{o.id} · {o.title}</h3>
              <p>{o.count} порц. · {money(o.sum)} · {o.pay}</p>
            </div>
          </div>
          <span className="tag">{o.office ? `🏢 ${o.company}${o.floor ? ", " + o.floor : ""}` : "Для себя"}</span>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s} className={"st" + (i <= o.step ? " done" : "")}><i>{i <= o.step ? "✓" : ""}</i>{s}</div>
            ))}
          </div>
          <div className="map">
            <svg viewBox="0 0 300 150" width="100%" height="100%" aria-label="Карта доставки">
              <path d="M20 120 C90 120 90 40 160 60 S250 40 280 30" fill="none" stroke="#1fa354" strokeWidth="3" strokeDasharray="6 6" />
              <text x="270" y="28" fontSize="22">📍</text>
              <text x="10" y="128" fontSize="20">🍳</text>
              <circle cx={DOT[o.step][0]} cy={DOT[o.step][1]} r="8" fill="#0f7a3d" />
            </svg>
          </div>
          <p style={{ fontSize: 13, color: "var(--mute)" }}>📍 {o.addr}</p>
        </div>
      ))}
    </>
  );
}

export default function App() {
  const [office, setOffice] = useState(true);
  const [loc, setLoc] = useState({ addr: "", company: "", floor: "" });
  const [view, setView] = useState("home");
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [sheet, setSheet] = useState(false);
  const [pay, setPay] = useState("payme");
  const [note, setNote] = useState("");

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((a, [id, n]) => a + n * DISHES.find((d) => d.id === +id).price, 0);
  const delivery = office ? 0 : 8000;

  const setQty = (id, delta) =>
    setCart((c) => {
      const n = Math.max(0, (c[id] || 0) + delta);
      const next = { ...c, [id]: n };
      if (!n) delete next[id];
      return next;
    });

  const place = () => {
    if (!loc.addr || (office && !loc.company)) return setSheet(true);
    const ids = Object.keys(cart);
    const first = DISHES.find((d) => d.id === +ids[0]).name;
    const id = 1001 + orders.length;
    setOrders((o) => [{
      id, office, ...loc, step: 0, count, sum: total + delivery,
      title: first + (ids.length > 1 ? ` и ещё ${ids.length - 1}` : ""),
      pay: PAY.find((p) => p[0] === pay)[1],
    }, ...o]);
    setCart({});
    setView("orders");
    const timer = setInterval(() => {
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, step: Math.min(3, o.step + 1) } : o)));
    }, 6000);
    setTimeout(() => clearInterval(timer), 6000 * 4);
  };

  const heading = view === "home" && (
    <>
      <h2>Обед на сегодня</h2>
      <p className="sub">Домашняя еда и кейтеринг с доставкой {office ? "прямо в офис" : "по вашему адресу"}.</p>
    </>
  );

  return (
    <div id="app">
      <header>
        <button className="loc" onClick={() => setSheet(true)}>
          <span style={{ fontSize: 22 }}>📍</span>
          <span>
            <b>{loc.addr || "Укажите адрес доставки"}</b>
            <small>{office ? (loc.company ? `Компания: ${loc.company}${loc.floor ? ", " + loc.floor : ""}` : "Укажите компанию для отслеживания") : "Доставка для себя"}</small>
          </span>
        </button>
        <div className="seg">
          <button className={office ? "on" : ""} onClick={() => setOffice(true)}>Для офиса</button>
          <button className={!office ? "on" : ""} onClick={() => setOffice(false)}>Для себя</button>
        </div>
      </header>

      <main>
        {heading}
        {view === "home" && <Catalog cart={cart} setQty={setQty} />}
        {view === "cart" && (
          <Cart cart={cart} setQty={setQty} office={office} loc={loc} pay={pay} setPay={setPay} note={note} setNote={setNote}
            total={total} delivery={delivery} onPlace={place} onLoc={() => setSheet(true)} onCatalog={() => setView("home")} />
        )}
        {view === "orders" && <Orders orders={orders} />}
      </main>

      {view === "home" && count > 0 && (
        <div className="bar"><button className="btn" onClick={() => setView("cart")}>Корзина · {count} шт. · {money(total)}</button></div>
      )}

      <nav>
        <button className={view === "home" ? "on" : ""} onClick={() => setView("home")}><span>🍱</span>Меню</button>
        <button className={view === "cart" ? "on" : ""} onClick={() => setView("cart")}><span>🛒</span>Корзина{count > 0 && <i className="dot">{count}</i>}</button>
        <button className={view === "orders" ? "on" : ""} onClick={() => setView("orders")}><span>📦</span>Заказы{orders.length > 0 && <i className="dot">{orders.length}</i>}</button>
      </nav>

      {sheet && (
        <LocationSheet office={office} {...loc}
          onClose={() => setSheet(false)}
          onSave={(v) => { setLoc(v); setSheet(false); }} />
      )}
    </div>
  );
}
